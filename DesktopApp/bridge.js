const {
  contextBridge,
  ipcRenderer
} = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'bridge', {
    log: (entry) => {
      ipcRenderer.send('log', entry);
    },
    // receive: (channel, func) => {
    //   let validChannels = ['fromMain'];
    //   if (validChannels.includes(channel)) {
    //     // Deliberately strip event as it includes `sender`
    //     ipcRenderer.on(channel, (event, ...args) => func(...args));
    //   }
    // }
  }
);

console.log('[PRELOADED]');
