﻿const { app } = require('electron');
const { BrowserWindow } = require('electron');
const path = require('path');
const cProcess = require('child_process').spawn;
const portscanner = require('portscanner');
const imageSize = require('image-size');
let io, server, browserWindows, ipc, apiProcess, loadURL;
let appApi, menu, dialogApi, notification, tray, webContents;
let globalShortcut, shellApi, screen, clipboard, autoUpdater;
let commandLine, browserView;
let powerMonitor;
let splashScreen, hostHook;
let mainWindowId, nativeTheme;
let dock;

let manifestJsonFileName = 'electron.manifest.json';
let watchable = false;
if (app.commandLine.hasSwitch('manifest')) {
    manifestJsonFileName = app.commandLine.getSwitchValue('manifest');
};

if (app.commandLine.hasSwitch('watch')) {
    watchable = true;
};

let currentBinPath = path.join(__dirname.replace('app.asar', ''), 'bin');
let manifestJsonFilePath = path.join(currentBinPath, manifestJsonFileName);

// if watch is enabled lets change the path
if (watchable) {
    currentBinPath = path.join(__dirname, '../../'); // go to project directory
    manifestJsonFilePath = path.join(currentBinPath, manifestJsonFileName);
}

const manifestJsonFile = require(manifestJsonFilePath);
if (manifestJsonFile.singleInstance || manifestJsonFile.aspCoreBackendPort) {
    const mainInstance = app.requestSingleInstanceLock();
    app.on('second-instance', () => {
        const windows = BrowserWindow.getAllWindows();
        if (windows.length) {
            if (windows[0].isMinimized()) {
                windows[0].restore();
            }
            windows[0].focus();
        }
    });

    if (!mainInstance) {
        app.quit();
    }
}

app.on('ready', () => {
    if (isSplashScreenEnabled()) {
        startSplashScreen();
    }

    // hostname needs to belocalhost, otherwise Windows Firewall will be triggered.
    portscanner.findAPortNotInUse(8000, 65535, 'localhost', function (error, port) {
        console.log('Electron Socket IO Port: ' + port);
        startSocketApiBridge(port);
    });

});

app.on('quit', async (event, exitCode) => {
    await server.close();
    apiProcess.kill();
});

function isSplashScreenEnabled() {
    if (manifestJsonFile.hasOwnProperty('splashscreen')) {
        if (manifestJsonFile.splashscreen.hasOwnProperty('imageFile')) {
            return Boolean(manifestJsonFile.splashscreen.imageFile);
        }
    }

    return false;
}

function startSplashScreen() {
    let imageFile = path.join(currentBinPath, manifestJsonFile.splashscreen.imageFile);
    imageSize(imageFile, (error, dimensions) => {
        if (error) {
            console.log(`load splashscreen error:`);
            console.error(error);

            throw new Error(error.message);
        }

        splashScreen = new BrowserWindow({
            width: dimensions.width,
            height: dimensions.height,
            transparent: true,
            center: true,
            frame: false,
            closable: false,
            skipTaskbar: true,
            show: true
        });

        app.once('browser-window-focus', () => {
            app.once('browser-window-focus', () => {
                splashScreen.destroy();
            });
        });

        const loadSplashscreenUrl = path.join(__dirname, 'splashscreen', 'index.html') + '?imgPath=' + imageFile;
        splashScreen.loadURL('file://' + loadSplashscreenUrl);

        splashScreen.once('closed', () => {
            splashScreen = null;
        });
    });
}

function startSocketApiBridge(port) {

    // instead of 'require('socket.io')(port);' we need to use this workaround
    // otherwise the Windows Firewall will be triggered
    server = require('http').createServer();
    io = require('socket.io')();
    io.attach(server);

    server.listen(port, 'localhost');
    server.on('listening', function () {
        console.log('Electron Socket started on port %s at %s', server.address().port, server.address().address);
        // Now that socket connection is established, we can guarantee port will not be open for portscanner
        if (watchable) {
            startAspCoreBackendWithWatch(port);
        } else {
            startAspCoreBackend(port);
        }
    });

    // prototype
    app['mainWindowURL'] = "";
    app['mainWindow'] = null;

    io.on('connection', (socket) => {

        // we need to remove previously cache instances 
        // otherwise it will fire the same event multiple depends how many time
        // live reload watch happen.
        socket.on('disconnect', function (reason) {
            console.log('Got disconnect! Reason: ' + reason);
            delete require.cache[require.resolve('./api/app')];
            delete require.cache[require.resolve('./api/browserWindows')];
            delete require.cache[require.resolve('./api/commandLine')];
            delete require.cache[require.resolve('./api/autoUpdater')];
            delete require.cache[require.resolve('./api/ipc')];
            delete require.cache[require.resolve('./api/menu')];
            delete require.cache[require.resolve('./api/dialog')];
            delete require.cache[require.resolve('./api/notification')];
            delete require.cache[require.resolve('./api/tray')];
            delete require.cache[require.resolve('./api/webContents')];
            delete require.cache[require.resolve('./api/globalShortcut')];
            delete require.cache[require.resolve('./api/shell')];
            delete require.cache[require.resolve('./api/screen')];
            delete require.cache[require.resolve('./api/clipboard')];
            delete require.cache[require.resolve('./api/browserView')];
            delete require.cache[require.resolve('./api/powerMonitor')];
            delete require.cache[require.resolve('./api/nativeTheme')];
            delete require.cache[require.resolve('./api/dock')];
        });

        global['electronsocket'] = socket;
        global['electronsocket'].setMaxListeners(0);
        console.log('ASP.NET Core Application connected...', 'global.electronsocket', global['electronsocket'].id, new Date());

        appApi = require('./api/app')(socket, app);
        browserWindows = require('./api/browserWindows')(socket, app);
        commandLine = require('./api/commandLine')(socket, app);
        autoUpdater = require('./api/autoUpdater')(socket);
        ipc = require('./api/ipc')(socket);
        menu = require('./api/menu')(socket);
        dialogApi = require('./api/dialog')(socket);
        notification = require('./api/notification')(socket);
        tray = require('./api/tray')(socket);
        webContents = require('./api/webContents')(socket);
        globalShortcut = require('./api/globalShortcut')(socket);
        shellApi = require('./api/shell')(socket);
        screen = require('./api/screen')(socket);
        clipboard = require('./api/clipboard')(socket);
        browserView = require('./api/browserView')(socket);
        powerMonitor = require('./api/powerMonitor')(socket);
        nativeTheme = require('./api/nativeTheme')(socket);
        dock = require('./api/dock')(socket);

        try {
            const hostHookScriptFilePath = path.join(__dirname, 'ElectronHostHook', 'index.js');

            if (isModuleAvailable(hostHookScriptFilePath) && hostHook === undefined) {
                const { HookService } = require(hostHookScriptFilePath);
                hostHook = new HookService(socket, app);
                hostHook.onHostReady();
            }
        } catch (error) {
            console.error(error.message);
        }
    });
}

function isModuleAvailable(name) {
    try {
        require.resolve(name);
        return true;
    } catch (e) { }
    return false;
}

function startAspCoreBackend(electronPort) {
    if (manifestJsonFile.aspCoreBackendPort) {
        startBackend(manifestJsonFile.aspCoreBackendPort)
    } else {
        // hostname needs to be localhost, otherwise Windows Firewall will be triggered.
        portscanner.findAPortNotInUse(electronPort + 1, 65535, 'localhost', function (error, electronWebPort) {
            startBackend(electronWebPort);
        });
    }

    function startBackend(aspCoreBackendPort) {
        console.log('ASP.NET Core Port: ' + aspCoreBackendPort);
        loadURL = `http://localhost:${aspCoreBackendPort}`;
        const parameters = [getEnvironmentParameter(), `/electronPort=${electronPort}`, `/electronWebPort=${aspCoreBackendPort}`];
        let binaryFile = manifestJsonFile.executable;

        const os = require('os');
        if (os.platform() === 'win32') {
            binaryFile = binaryFile + '.exe';
        }

        let binFilePath = path.join(currentBinPath, binaryFile);
        var options = { cwd: currentBinPath };
        apiProcess = cProcess(binFilePath, parameters, options);

        apiProcess.stdout.on('data', (data) => {
            console.log(`stdout: ${data.toString()}`);
        });
    }
}

function startAspCoreBackendWithWatch(electronPort) {
    if (manifestJsonFile.aspCoreBackendPort) {
        startBackend(manifestJsonFile.aspCoreBackendPort)
    } else {
        // hostname needs to be localhost, otherwise Windows Firewall will be triggered.
        portscanner.findAPortNotInUse(electronPort + 1, 65535, 'localhost', function (error, electronWebPort) {
            startBackend(electronWebPort);
        });
    }

    function startBackend(aspCoreBackendPort) {
        console.log('ASP.NET Core Watch Port: ' + aspCoreBackendPort);
        loadURL = `http://localhost:${aspCoreBackendPort}`;
        const parameters = ['watch', 'run', getEnvironmentParameter(), `/electronPort=${electronPort}`, `/electronWebPort=${aspCoreBackendPort}`];

        var options = {
            cwd: currentBinPath,
            env: process.env,
        };
        apiProcess = cProcess('dotnet', parameters, options);

        apiProcess.stdout.on('data', (data) => {
            console.log(`stdout: ${data.toString()}`);
        });
    }
}

function getEnvironmentParameter() {
    if(manifestJsonFile.environment) {
        return '--environment=' + manifestJsonFile.environment;
    }

    return '';
}