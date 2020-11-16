"use strict";
const electron_1 = require("electron");
let tray;
let electronSocket;
module.exports = (socket) => {
    electronSocket = socket;
    socket.on('register-tray-click', (id) => {
        if (tray) {
            tray.on('click', (event, bounds) => {
                electronSocket.emit('tray-click-event' + id, [event.__proto__, bounds]);
            });
        }
    });
    socket.on('register-tray-right-click', (id) => {
        if (tray) {
            tray.on('right-click', (event, bounds) => {
                electronSocket.emit('tray-right-click-event' + id, [event.__proto__, bounds]);
            });
        }
    });
    socket.on('register-tray-double-click', (id) => {
        if (tray) {
            tray.on('double-click', (event, bounds) => {
                electronSocket.emit('tray-double-click-event' + id, [event.__proto__, bounds]);
            });
        }
    });
    socket.on('register-tray-balloon-show', (id) => {
        if (tray) {
            tray.on('balloon-show', () => {
                electronSocket.emit('tray-balloon-show-event' + id);
            });
        }
    });
    socket.on('register-tray-balloon-click', (id) => {
        if (tray) {
            tray.on('balloon-click', () => {
                electronSocket.emit('tray-balloon-click-event' + id);
            });
        }
    });
    socket.on('register-tray-balloon-closed', (id) => {
        if (tray) {
            tray.on('balloon-closed', () => {
                electronSocket.emit('tray-balloon-closed-event' + id);
            });
        }
    });
    socket.on('create-tray', (image, menuItems) => {
        const trayIcon = electron_1.nativeImage.createFromPath(image);
        tray = new electron_1.Tray(trayIcon);
        if (menuItems) {
            const menu = electron_1.Menu.buildFromTemplate(menuItems);
            addMenuItemClickConnector(menu.items, (id) => {
                electronSocket.emit('trayMenuItemClicked', id);
            });
            tray.setContextMenu(menu);
        }
    });
    socket.on('tray-destroy', () => {
        if (tray) {
            tray.destroy();
        }
    });
    socket.on('tray-setImage', (image) => {
        if (tray) {
            tray.setImage(image);
        }
    });
    socket.on('tray-setPressedImage', (image) => {
        if (tray) {
            const img = electron_1.nativeImage.createFromPath(image);
            tray.setPressedImage(img);
        }
    });
    socket.on('tray-setToolTip', (toolTip) => {
        if (tray) {
            tray.setToolTip(toolTip);
        }
    });
    socket.on('tray-setTitle', (title) => {
        if (tray) {
            tray.setTitle(title);
        }
    });
    socket.on('tray-displayBalloon', (options) => {
        if (tray) {
            tray.displayBalloon(options);
        }
    });
    socket.on('tray-isDestroyed', () => {
        if (tray) {
            const isDestroyed = tray.isDestroyed();
            electronSocket.emit('tray-isDestroyedCompleted', isDestroyed);
        }
    });
    function addMenuItemClickConnector(menuItems, callback) {
        menuItems.forEach((item) => {
            if (item.submenu && item.submenu.items.length > 0) {
                addMenuItemClickConnector(item.submenu.items, callback);
            }
            if ('id' in item && item.id) {
                item.click = () => { callback(item.id); };
            }
        });
    }
};
//# sourceMappingURL=tray.js.map