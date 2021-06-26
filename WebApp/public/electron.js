const electron = require('electron');
const { spawn } = require('child_process');
const builderUtils = require('@openworkshop/maker-builder/utils');
const app = electron.app;
const remote = electron.remote;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');

let mainWindow;

if (!process.env['MAKER_HUB_PORT']) {
  console.log('Misconfigured environment; missing: MAKER_HUB_PORT');
  process.exit(1);
}

async function launchBackend(beEnv) {
  let proc = undefined;
  if (beEnv !== 'Production') {
    console.log('[APP] Spawning Dotnet Development Backend ');
    proc = spawn('dotnet', ['watch', '--project', '../', 'run']);
  } else {
    const fn = path.join('bin', 'Makerverse.dll');
    console.log('[APP] Spawning Dotnet Release Backend via', fn);
    proc = spawn('dotnet', [fn]);
  }
  proc.stdout.pipe(process.stdout);
  proc.stderr.pipe(process.stderr);
}

async function createWindow() {
  const backendEnv = process.env['ASPNETCORE_ENVIRONMENT'] ?? 'Production';
  await launchBackend(backendEnv);

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
  console.log('[APP]', 'waiting on', backendRoot);
  await builderUtils.execute(`yarn exec wait-on ${backendRoot}`);

  const backendUrl = `${schema}://${frontendHost}${portStr}`;
  console.log('[APP]', 'loading', backendUrl);
  mainWindow = new BrowserWindow({width: 900, height: 680});
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
