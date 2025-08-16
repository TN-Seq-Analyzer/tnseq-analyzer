export interface IElectronAPI {
  getLanguage: () => Promise<string>;
  setLanguage: (language: string) => Promise<string>;
}

type FileDialogResult = () => Promise<{
  filePath: string;
  fileContent?: string;
} | null>;

export interface IElectronFileAPI {
  openFileDialogFastq: FileDialogResult;
  openFileDialogFasta: FileDialogResult;
  openFileDialogGff: FileDialogResult;
  openFileDialogDirectory: FileDialogResult;
  getFiles: () => Promise<any>;
  setFiles: (files: any) => Promise<any>;
  newProject: () => Promise<any>;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
    electronFile: IElectronFileAPI;
  }
}
