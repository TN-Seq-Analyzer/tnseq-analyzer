import { BrowserWindow } from "electron";
import path from "node:path";

let mainWindow: BrowserWindow | null = null;

export const createWindow = (): BrowserWindow => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 950,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
    autoHideMenuBar: true,
    resizable: false,
  });

  // Load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }

  // Open the DevTools in development
  // mainWindow.webContents.openDevTools();

  return mainWindow;
};

export const getMainWindow = (): BrowserWindow | null => {
  return mainWindow;
};

export const getAllWindows = (): BrowserWindow[] => {
  return BrowserWindow.getAllWindows();
};
