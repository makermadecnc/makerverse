const electron = require('electron');
const { autoUpdater } = require('electron-updater');
const { spawn } = require('child_process');
const path = require('path');
const electronDev = require('electron-is-dev');
const waitOn = require('wait-on');
const fs = require('fs');
const dotenv = require('dotenv');
const BrowserWindow = electron.BrowserWindow;

// Globals
const hubEnv = {
  env: 'ASPNETCORE_ENVIRONMENT', beEnv: 'MAKER_HUB_BACKEND_ENVIRONMENT', productName: 'PRODUCT_NAME',
  fePort: 'MAKER_HUB_FRONTEND_PORT', bePort:'MAKER_HUB_PORT'
};

// DesktopApp class
class DesktopApp {
  mainWindow = null;
  serverProc = null;

  constructor(resourcesPath = 'bin') {
    console.log('[APP]', 'start');
    this.app = electron.app;
    const appPath = this.app.getAppPath();
    const rootPath = path.normalize(path.join(appPath, '..'));
    this.binPath = path.join(rootPath, resourcesPath);
    this.configureEnvironment();
    this.productName = process.env[hubEnv.productName];

    this.paths = {
      // home: this.app.getPath('home'),
      // appData: this.app.getPath('appData'),
      bin: this.binPath,
      userData: this.app.getPath('userData'),
      documents: this.app.getPath('documents'),
      logs: this.app.getPath('logs'),
      // crashDumps: this.app.getPath('crashDumps'),
      // temp: this.app.getPath('temp'),
    };

    console.log('[APP]', 'paths', this.paths);

    // Spawn electron (ready invokes launch)
    this.app.on('window-all-closed', this.onAllClosed.bind(this));
    this.app.on('activate', this.onActivated.bind(this));
    this.app.on('ready', this.launch.bind(this));
    this.app.on('will-quit', this.shutdown.bind(this));
  }

  // Set & check environment variables.
  configureEnvironment = () => {
    process.env['MAKER_HUB_APP_DIR'] = this.binPath;
    console.log('[APP]', process.platform, '@', this.binPath);

    const envFp = path.join(this.binPath, 'hub.env');
    if (!fs.existsSync(envFp)) {
      console.log('Missing', envFp);
    }

    dotenv.config({ path: envFp });
    console.log('[APP]', envFp, 'v', this.app.getVersion(), process.env[hubEnv.env]);

    Object.values(hubEnv).forEach(ev => {
      if (!process.env[ev]) {
        console.log('Misconfigured environment; missing: ' + ev);
        process.exit(1);
      }
    });
  }

  shutdown = () => {
    console.log('[APP]', 'shutdown');
    if (this.serverProc) {
      this.serverProc.stdin.pause();
      this.serverProc.kill();
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
      console.log('[UPDATE]', 'failed', e);
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
      console.log('[APP] Spawning Dotnet Development Server');
      process.chdir('../');
      proc = spawn('dotnet', ['watch', 'run'].concat(flags));
    } else {
      const fnParts = [this.productName];
      if (process.platform.startsWith('win')) fnParts.push('exe');
      const exeFn = fnParts.join('.');

      // If not in electronDev, we cannot be using development assets...
      const exeFp = path.join(this.binPath, exeFn);

      console.log('[APP] Spawning Dotnet Server via', exeFn, flags);
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
      console.log('[APP]', 'waiting on frontend', fePort);
      await waitOn({ resources: [`http://localhost:${fePort}`] });
      console.log('[APP]', fePort, 'ready');
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
    console.log('[APP]', 'waiting on', backendRoot);
    await waitOn({ resources: [backendRoot] });
    console.log('[APP]', backendRoot, 'ready');

    const backendUrl = `${schema}://${frontendHost}${portStr}`;
    console.log('[APP]', 'loading', backendUrl);
    this.mainWindow = new BrowserWindow({ width: 800, height: 600 });
    this.mainWindow.maximize();
    await this.mainWindow.loadURL(backendUrl);
    this.mainWindow.on('closed', () => this.mainWindow = null);
  }
}

new DesktopApp();
