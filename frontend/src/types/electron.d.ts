export interface IElectronAPI {
  getLanguage: () => Promise<string>;
  setLanguage: (language: string) => Promise<string>;
}

export interface IElectronFileAPI {
  openFileDialogFastq: () => Promise<{
    filePath: string;
    fileContent: string;
  } | null>;
  openFileDialogFasta: () => Promise<{
    filePath: string;
    fileContent: string;
  } | null>;
  openFileDialogGff: () => Promise<{
    filePath: string;
    fileContent: string;
  } | null>;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
    electronFile: IElectronFileAPI;
  }
}
