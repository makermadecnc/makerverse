const electron = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const url = require('url');
const electronDev = require('electron-is-dev');
const waitOn = electronDev ? require('wait-on') : undefined;
const app = electron.app;
// const remote = electron.remote;
const BrowserWindow = electron.BrowserWindow;

const productionEnv = 'Production';
const defaultEnv = electronDev ? 'Development' : 'Production';
const aspEnvVar = 'ASPNETCORE_ENVIRONMENT';

const appPath = app.getAppPath();
// const origRootDir = process.cwd();
process.chdir(appPath);
const builderUtils = require('@openworkshop/maker-builder/utils');
require('dotenv').parse(path.join(appPath, '.env'));
console.log('[APP]', appPath, 'v', app.getVersion(), process.env[aspEnvVar]);

let mainWindow;

if (!process.env['MAKER_HUB_PORT']) {
  console.log('Misconfigured environment; missing: MAKER_HUB_PORT', process.env);
  process.exit(1);
}

async function launchBackend() {
  let proc;
  if (electronDev) {
    console.log('[APP] Spawning Electron Development Backend ');
    process.chdir('../');
    proc = spawn('dotnet', ['watch', 'run']);
  } else {
    const fn = 'Makerverse.dll'; // In self-contained production
    // If not in electronDev, we cannot be using development assets...
    if (process.env[aspEnvVar] === 'Development') process.env[aspEnvVar] = 'Staging';
    console.log('[APP] Spawning Dotnet', process.env[aspEnvVar],'Backend via', fn);
    proc = spawn('dotnet', [fn, `--${aspEnvVar}`, process.env[aspEnvVar]]);
  }
  proc.stdout.pipe(process.stdout);
  proc.stderr.pipe(process.stderr);
}

async function createWindow() {
  if (electronDev) {
    const fePort = process.env['MAKER_HUB_FRONTEND_PORT'] ?? 3000;
    console.log('[APP]', 'waiting on frontend', fePort);
    await waitOn({ resources: [`http://localhost:${fePort}`] });
    console.log('[APP]', fePort, 'ready');
  }

  await launchBackend();

  const port = process.env['MAKER_HUB_PORT'];
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
  if (electronDev) {
    console.log('[APP]', 'waiting on', backendRoot);
    await waitOn({ resources: [backendRoot] });
    console.log('[APP]', backendRoot, 'ready');
  }

  const backendUrl = `${schema}://${frontendHost}${portStr}`;
  console.log('[APP]', 'loading', backendUrl);
  mainWindow = new BrowserWindow({ width: 800, height: 600 });
  await mainWindow.loadURL(backendUrl);
  mainWindow.on('closed', () => mainWindow = null);
}

// Spawn electron

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    void createWindow();
  }
});
