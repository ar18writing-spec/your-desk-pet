import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import activeWin from 'active-win';

let mainWindow: BrowserWindow | null = null;
let activeWindowPollingInterval: NodeJS.Timer | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 420,
    height: 420,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    }
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => { mainWindow = null; });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  // Start polling active window for distractor detection
  activeWindowPollingInterval = setInterval(async () => {
    try {
      const info = await activeWin();
      // send active window info to renderer
      mainWindow?.webContents.send('active-window', info);
    } catch (e) {
      console.error('active-win failed', e);
    }
  }, 1500);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
  if (activeWindowPollingInterval) clearInterval(activeWindowPollingInterval);
});

// handle settings save / get from renderer
ipcMain.handle('get-settings', async () => {
  // TODO: return persisted settings (electron-store)
  return {};
});

// Optional: receive messages from extension/native host via main process if you wire native messaging to it.
ipcMain.on('native-message', (_ev, msg) => {
  console.log('native message from preload/extension:', msg);
});
