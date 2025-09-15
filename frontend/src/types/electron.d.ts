import { AdvancedParams, FileData, FileDialogResult } from "./index";

export interface IElectronAPI {
  getLanguage: () => Promise<string>;
  setLanguage: (language: string) => Promise<string>;
}

type FileDialogResultFunction = () => Promise<FileDialogResult | null>;

export interface IElectronFileAPI {
  openFileDialogFastq: FileDialogResultFunction;
  openFileDialogFasta: FileDialogResultFunction;
  openFileDialogGff: FileDialogResultFunction;
  openFileDialogDirectory: FileDialogResultFunction;
  getFiles: () => Promise<FileData>;
  setFiles: (files: FileData) => Promise<boolean>;
  newProject: (name: string) => Promise<void>;
  setProjectName: (name: string) => Promise<boolean>;
  exportProject: () => Promise<boolean>;
  getAdvancedParams: () => Promise<AdvancedParams>;
  setAdvancedParams: (advancedParams: AdvancedParams) => Promise<boolean>;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
    electronFile: IElectronFileAPI;
  }
}
