// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  getLanguage: () => ipcRenderer.invoke("get-language"),
  setLanguage: (language: string) =>
    ipcRenderer.invoke("set-language", language),
});

contextBridge.exposeInMainWorld("electronFile", {
  openFileDialogFastq: () => ipcRenderer.invoke("openFileDialogFastq"),
  openFileDialogGff: () => ipcRenderer.invoke("openFileDialogGff"),
  openFileDialogFasta: () => ipcRenderer.invoke("openFileDialogFasta"),
  openFileDialogDirectory: () => ipcRenderer.invoke("openFileDialogDirectory"),
  getFiles: () => ipcRenderer.invoke("get-files"),
  setFiles: (files: any) => ipcRenderer.invoke("set-files", files),
  newProject: (name: string) => ipcRenderer.invoke("new-project", name),
  setProjectName: (name: string) =>
    ipcRenderer.invoke("set-project-name", name),
  exportProject: () => ipcRenderer.invoke("export-project"),
  getAdvancedParams: () => ipcRenderer.invoke("get-advanced-params"),
  setAdvancedParams: (advancedParams: any) =>
    ipcRenderer.invoke("set-advanced-params", advancedParams),
});
