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

// Globals
const hubEnv = {
  env: 'ASPNETCORE_ENVIRONMENT', beEnv: 'MAKER_HUB_BACKEND_ENVIRONMENT', productName: 'MAKER_HUB_PROJECT',
  fePort: 'MAKER_HUB_FRONTEND_PORT', bePort:'MAKER_HUB_PORT'
};

// DesktopApp class
class DesktopApp {
  mainWindow = null;
  serverProc = null;
  webAppProc = null;

  constructor(resourcesPath = 'bin') {
    this.log('start', ipcMain);
    this.app = app;

    electronLog.transports.console.format = '%c{h}:{i}:{s}.{ms}%c <{level}> {text}';

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

    this.log('paths', this.paths);

    // Spawn electron (ready invokes launch)
    this.app.on('window-all-closed', this.onAllClosed.bind(this));
    this.app.on('activate', this.onActivated.bind(this));
    this.app.on('ready', this.launch.bind(this));
    this.app.on('before-quit', this.shutdown.bind(this));
    this.app.on('will-quit', this.shutdown.bind(this));
    this.app.on('quit', this.shutdown.bind(this));

    ipcMain.on('log', (event, args) => {
      this.writeLogEntry(args);
    });
  }

  normalizeLogLevel = (level) => {
    if (level === 'debug') return 'DBG';
    if (level === 'warn') return 'WRN';
    if (level === 'error') return 'ERR';
    return 'INF';
  }

  writeLogEntry = (logEntry) => {
    const parts = [`<${this.normalizeLogLevel(logEntry.level)} #0>`, `[${logEntry.context}]`].concat(logEntry.message);
    if (logEntry.level === 'debug') {
      electronLog.debug(...parts);
    } else if (logEntry.level === 'warn') {
      electronLog.warn(...parts);
    } else if (logEntry.level === 'error') {
      electronLog.error(...parts);
    } else {
      electronLog.info(...parts);
    }
  }

  // LogEntry is prepackaged by DefaultLogger
  log = (...args) => {
    this.writeLogEntry({ message: args, context: 'APP', timestamp: new Date().toLocaleTimeString('en-GB') });
  }

  // Set & check environment variables.
  configureEnvironment = () => {
    process.env['MAKER_HUB_APP_DIR'] = this.binPath;
    this.log(process.platform, '@', this.binPath);

    const envFp = path.join(electronDev ? this.rootPath : this.binPath, 'hub.env');
    if (!fs.existsSync(envFp)) {
      this.log('Missing', envFp);
    }

    dotenv.config({ path: envFp });
    this.log(envFp, 'v', this.app.getVersion(), process.env[hubEnv.env]);

    Object.values(hubEnv).forEach(ev => {
      if (!process.env[ev]) {
        this.log('Misconfigured environment; missing: ' + ev);
        process.exit(1);
      }
    });
  }

  shutdown = () => {
    if (this.serverProc) {
      this.log('shutdown', 'server');
      this.serverProc.kill();
      this.serverProc = null;
    }
    if (this.webAppProc) {
      this.log('shutdown', 'WebApp');
      this.webAppProc.kill();
      this.webAppProc = null;
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
      this.log('[UPDATE]', 'failed', e);
    }
    this.serverProc = await this.launchServer();
    await this.launchFrontend();
  }

  // Spawn the dotnet environment
  launchServer = async () => {
    let proc;

    const flags = ['--MAKER_HUB_ELECTRON=true'];
    Object.keys(this.paths).forEach(k => {
      flags.push(`--path.${k}=\"${this.paths[k]}\"`);
    });

    if (electronDev) {
      // this.log('Spawning WebApp frontend...');
      // process.chdir(path.join('..', '..', '..'));
      // this.webAppProc = spawn('yarn', ['start']);
      // this.webAppProc.stdout.pipe(process.stdout);
      // this.webAppProc.stderr.pipe(process.stderr);

      Object.keys(process.env).forEach(k => {
        if (k.startsWith('MAKER_')) flags.push(`--${k}=\"${process.env[k]}\""`)
      });

      process.chdir(path.join('src', 'projects', this.productName, 'Server'));
      this.log('Spawning Dotnet Development Server', process.cwd(), flags);
      proc = spawn('dotnet', ['watch', 'run'].concat(flags));
    } else {
      const fnParts = [this.productName];
      if (process.platform.startsWith('win')) fnParts.push('exe');
      const exeFn = fnParts.join('.');

      // If not in electronDev, we cannot be using development assets...
      const exeFp = path.join(this.binPath, exeFn);

      this.log('Spawning Dotnet Server via', exeFn, flags);
      proc = spawn(exeFp, flags);
    }
    proc.stdout.pipe(process.stdout);
    proc.stderr.pipe(process.stderr);
    return proc;
  }

  // Create electron window
  launchFrontend = async () => {
    if (electronDev) {
      const fePort = process.env[hubEnv.fePort] ?? 3000;
      this.log('waiting on frontend', fePort);
      await waitOn({ resources: [`http://localhost:${fePort}`] });
      this.log(fePort, 'ready');
    }

    const port = process.env[hubEnv.bePort];
    const frontendHost = 'localhost';
    const portNum = parseInt(port);
    let portStr = '';
    let schema = 'http';
    if (portNum === 443) {
      schema = 'https';
    } else if (portNum !== 443) {
      portStr = `:${port}`;
    }

    const backendRoot = `${schema}://${frontendHost}${portStr}`;
    this.log('waiting on', backendRoot);
    await waitOn({ resources: [backendRoot] });
    this.log(backendRoot, 'ready');

    const backendUrl = `${schema}://${frontendHost}${portStr}`;
    this.log('loading', backendUrl);
    this.mainWindow = new BrowserWindow({ width: 800, height: 600, webPreferences: {
        nodeIntegration: false, // is default value after Electron v5
        contextIsolation: true, // protect against prototype pollution
        enableRemoteModule: false, // turn off remote
        preload: path.join(__dirname, "bridge.js") // use a preload script
    }});
    this.mainWindow.on('preferred-size-changed', (s) => {
      this.log('size', s);
    });
    await this.mainWindow.loadURL(backendUrl);
    this.mainWindow.on('closed', () => this.mainWindow = null);
  }
}

module.exports = DesktopApp;