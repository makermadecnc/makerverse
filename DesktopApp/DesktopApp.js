#!/usr/bin/env node
const { app, BrowserWindow, ipcMain } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const electronDev = require('electron-is-dev');
const electronLog = require('electron-log');
const { autoUpdater } = require('electron-updater');
const waitOn = require('wait-on');
const fs = require('fs');
const dotenv = require('dotenv');
const nodePortScanner = require('node-port-scanner');

// Globals
const hubEnv = {
  env: 'ASPNETCORE_ENVIRONMENT', beEnv: 'MAKER_HUB_BACKEND_ENVIRONMENT', productName: 'MAKER_HUB_PROJECT',
  fePort: 'MAKER_HUB_FRONTEND_PORT', bePort:'MAKER_HUB_PORT'
};
const localHost = '127.0.0.1';

// DesktopApp class
class DesktopApp {
  mainWindow = null;
  serverProc = null;

  constructor(resourcesPath = 'bin') {
    this.app = app;

    // Set up logging...
    // electronLog.transports.console.format = '%c{h}:{i}:{s}.{ms}%c <{level}> {text}';
    electronLog.transports.console.level = 'error';
    electronLog.transports.file.format = '%c{h}:{i}:{s}.{ms}%c <{level}> {text}';
    electronLog.transports.file.level = 'debug';
    autoUpdater.logger = electronLog;
    electronLog.log('start');

    // https://github.com/nodejs/node/issues/13538#issuecomment-307002165
    process.on('exit', () => this.shutdown());

    this.bePort = process.env[hubEnv.bePort] ?? 8000;
    this.serverUrl = this.getServerUrl(this.bePort);
    const appPath = this.app.getAppPath();
    this.rootPath = path.normalize(path.join(appPath, '..'));
    this.binPath = electronDev ? path.join(this.rootPath, 'Server') : path.join(this.rootPath, resourcesPath);

    this.configureEnvironment();
    this.productName = process.env[hubEnv.productName];

    this.paths = {
      // home: this.app.getPath('home'),
      // appData: this.app.getPath('appData'),
      bin: this.binPath,
      root: this.rootPath,
      userData: electronDev ? this.rootPath : this.app.getPath('userData'),
      documents: electronDev ? this.rootPath : this.app.getPath('documents'),
      logs: electronDev ? this.rootPath : this.app.getPath('logs'),
      // crashDumps: this.app.getPath('crashDumps'),
      // temp: this.app.getPath('temp'),
    };

    electronLog.log('paths', this.paths);

    // Spawn electron (ready invokes launch)
    this.app.on('window-all-closed', this.onAllClosed.bind(this));
    this.app.on('activate', this.onActivated.bind(this));
    this.app.on('ready', this.launch.bind(this));
    this.app.on('before-quit', this.shutdown.bind(this));
    this.app.on('will-quit', this.shutdown.bind(this));
    this.app.on('quit', this.shutdown.bind(this));

    ipcMain.on('log', (event, ...args) => {
      this.writeLogEntry(...args);
    });
  }

  normalizeLogLevel = (l) => {
    if (l === 1 || l === 'verbose') return 'VRB';
    if (l === 2 || l === 'debug') return 'DBG';
    if (l === 4 || l === 'warn') return 'WRN';
    if (l === 5 || l === 'error') return 'ERR';
    return 'INF';
  }

  writeLogEntry = (...args) => {
    const level = this.normalizeLogLevel(args.shift());
    const parts = args.shift();
    if (level === 'DBG') {
      electronLog.debug(...parts);
    } else if (level === 'VRB') {
      electronLog.verbose(...parts);
    } else if (level === 'WRN') {
      electronLog.warn(...parts);
    } else if (level === 'ERR') {
      electronLog.error(...parts);
    } else {
      electronLog.info(...parts);
    }
  }

  // Set & check environment variables.
  configureEnvironment = () => {
    process.env['MAKER_HUB_APP_DIR'] = this.binPath;
    electronLog.log(process.platform, '@', this.binPath);

    const envFp = path.join(electronDev ? this.rootPath : this.binPath, 'hub.env');
    if (!fs.existsSync(envFp)) {
      electronLog.log('Missing', envFp);
    }

    dotenv.config({ path: envFp });
    electronLog.log(envFp, 'v', this.app.getVersion(), process.env[hubEnv.env]);

    Object.values(hubEnv).forEach(ev => {
      if (!process.env[ev]) {
        electronLog.log('Misconfigured environment; missing: ' + ev);
        process.exit(1);
      }
    });
  }

  shutdown = () => {
    if (this.serverProc) {
      electronLog.log('shutdown', 'server');
      this.serverProc.kill();
      this.serverProc = null;
    }
  }

  onAllClosed = () => {
    if (process.platform !== 'darwin') {
      this.app.quit();
    }
  }

  onActivated = () => {
    if (this.mainWindow === null) {
      void this.launch();
    }
  }

  launch = async() => {
    try {
      await autoUpdater.checkForUpdatesAndNotify();
    } catch (e) {
      electronLog.error('[UPDATE]', 'failed', e);
    }
    this.serverProc = await this.launchServer();
    await this.launchFrontend();
  }

  // Spawn the dotnet environment
  launchServer = async () => {
    let proc;

    // Scan open ports.
    // n.b., this only logs (does not abort) for now.
    try {
      const status = await nodePortScanner(localHost, [this.bePort, this.bePort + 1, this.bePort + 2]);
      electronLog.log('[PORT]', localHost, this.bePort, 'status', status);
    } catch (e) {
      electronLog.log('[PORT', localHost, this.bePort, '[ERROR]', e);
    }

    // Generate CLI flags for the app/server
    const flags = [];
    Object.keys(this.paths).forEach(k => {
      flags.push(`--path.${k}=\"${this.paths[k]}\"`);
    });
    flags.push('--MAKER_HUB_ELECTRON=true');

    // Actually spawn the dotnet/application server
    if (electronDev) {
      Object.keys(process.env).forEach(k => {
        if (k.startsWith('MAKER_')) flags.push(`--${k}=\"${process.env[k]}\""`)
      });

      // dev bin path = where the code resides
      electronLog.log('Spawning Dotnet Development Server', this.binPath, flags);
      process.chdir(this.binPath);
      proc = spawn('dotnet', ['watch', 'run'].concat(flags));
    } else {
      const fnParts = [this.productName];
      if (process.platform.startsWith('win')) fnParts.push('exe');
      const exeFn = fnParts.join('.');

      // If not in electronDev, we cannot be using development assets...
      const exeFp = path.join(this.binPath, exeFn);

      electronLog.log('Spawning Dotnet Server via', exeFn, flags);
      proc = spawn(exeFp, flags);
    }
    proc.stdout.pipe(process.stdout);
    proc.stderr.pipe(process.stderr);
    return proc;
  }

  // Create electron window
  launchFrontend = async () => {
    const resources = [];
    if (electronDev) {
      // In Dev mode, wait on the frontend first (which the backend proxies to, instead of hosting, like in prod)
      resources.push(this.getServerUrl(process.env[hubEnv.fePort] ?? 3000));
    }
    resources.push(this.serverUrl);

    electronLog.log('[WAIT-ON]', resources);
    await waitOn({ resources });

    this.mainWindow = new BrowserWindow({ width: 800, height: 600, webPreferences: {
        // Set up the bride.js for inter-process communication.
        nodeIntegration: false, // is default value after Electron v5
        contextIsolation: true, // protect against prototype pollution
        enableRemoteModule: false, // turn off remote
        preload: path.join(__dirname, "bridge.js") // use a preload script
      }});
    this.mainWindow.on('preferred-size-changed', (s) => {
      electronLog.log('size', s);
    });
    await this.mainWindow.loadURL(this.serverUrl);
    this.mainWindow.on('closed', () => this.mainWindow = null);
  }

  getServerUrl = (port) => {
    const portNum = parseInt(port);
    let portStr = '';
    let schema = 'http';
    if (portNum === 443) {
      schema = 'https';
    } else if (portNum !== 80) {
      portStr = `:${port}`;
    }
    return `${schema}://${localHost}${portStr}`;
  }
}

module.exports = DesktopApp;