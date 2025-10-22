import { registerHandlers } from "./lib/ipcHandlers";
import { createWindow, getAllWindows } from "./lib/windowManager";
import { app } from "electron";
import path from "node:path";
import started from "electron-squirrel-startup";
import { spawn, ChildProcessWithoutNullStreams } from "child_process";

let pythonProcess: ChildProcessWithoutNullStreams | null = null;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

// Register all IPC handlers
registerHandlers();

const startBackend = () => {
  const script = path.join(__dirname, "../../../backend/main.py");
  pythonProcess = spawn("cd ../backend && uv run main.py", { shell: true });

  pythonProcess.stdout.on("data", (data) => {
    console.log(`Python: ${data}`);
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`Python: ${data}`);
  });

  pythonProcess.on("close", (code) => {
    console.log(`Python process exited with code ${code}`);
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  // startBackend();
  createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }

  if (pythonProcess) {
    pythonProcess.kill();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (getAllWindows().length === 0) {
    createWindow();
  }
});
