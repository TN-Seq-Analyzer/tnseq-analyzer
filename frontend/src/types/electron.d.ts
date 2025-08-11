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
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
    electronFile: IElectronFileAPI;
  }
}
