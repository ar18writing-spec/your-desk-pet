import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('deskPetAPI', {
  onActiveWindow: (cb: (info: any) => void) => {
    ipcRenderer.on('active-window', (_ev, info) => cb(info));
  },
  getSettings: () => ipcRenderer.invoke('get-settings'),
  // allow sending focus-complete or native-host messages
  sendNativeMessage: (msg: any) => ipcRenderer.send('native-message', msg)
});
