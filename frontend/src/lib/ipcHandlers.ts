import { ipcMain } from "electron";
import {
  handleOpenFileDialogDirectory,
  handleOpenFileDialogFasta,
  handleOpenFileDialogFastq,
  handleOpenFileDialogGff,
} from "./dialogs";
import {
  createNewProject,
  getAdvancedParams,
  loadFiles,
  saveFiles,
  setAdvancedParams,
  setProjectName,
  exportProjectToPath,
} from "./fileManager";
import { dialog } from "electron";
import { getLanguage, setLanguage } from "./languageSettingsManager";

const registerFileHandlers = (): void => {
  ipcMain.handle("get-files", () => {
    return loadFiles();
  });

  ipcMain.handle("set-files", (event, files) => {
    saveFiles(files);
    return true;
  });

  ipcMain.handle("new-project", (_event, name: string) => {
    createNewProject(name);
  });

  ipcMain.handle("set-project-name", (_event, name: string) => {
    return setProjectName(name);
  });

  ipcMain.handle("export-project", async () => {
    const { canceled, filePath } = await dialog.showSaveDialog({
      defaultPath: `${loadFiles().projectName || "project"}.json`,
      filters: [
        {
          name: "JSON",
          extensions: ["json"],
        },
      ],
    });
    if (canceled || !filePath) return false;
    return exportProjectToPath(filePath);
  });

  ipcMain.handle("get-advanced-params", () => {
    return getAdvancedParams();
  });

  ipcMain.handle("set-advanced-params", (event, advancedParams) => {
    return setAdvancedParams(advancedParams);
  });
};

const registerSettingsHandlers = (): void => {
  ipcMain.handle("get-language", () => {
    return getLanguage();
  });

  ipcMain.handle("set-language", (event, language: string) => {
    return setLanguage(language);
  });
};

const registerDialogHandlers = (): void => {
  ipcMain.handle("openFileDialogFastq", async () => {
    return await handleOpenFileDialogFastq();
  });

  ipcMain.handle("openFileDialogGff", async () => {
    return await handleOpenFileDialogGff();
  });

  ipcMain.handle("openFileDialogFasta", async () => {
    return await handleOpenFileDialogFasta();
  });

  ipcMain.handle("openFileDialogDirectory", async () => {
    return await handleOpenFileDialogDirectory();
  });
};

export const registerHandlers = (): void => {
  registerFileHandlers();
  registerSettingsHandlers();
  registerDialogHandlers();
};
