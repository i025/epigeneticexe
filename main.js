const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');

function resolveHomepageEntry() {
  const reactHomepage = path.join(__dirname, 'pencil-new-react', 'dist', 'index.html');

  if (fs.existsSync(reactHomepage)) {
    return reactHomepage;
  }

  return path.join(__dirname, 'index.html');
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 960,
    minWidth: 1100,
    minHeight: 760,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile(resolveHomepageEntry());
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
