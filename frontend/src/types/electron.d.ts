import { AdvancedParams, FileData, FileDialogResult } from "./index";
import { AnalysisRecord } from "../utils/analysisHistoryFileUtils";

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
  importProject: () => Promise<{
    success: boolean;
    error?: string;
    data?: FileData;
  }>;
  getAdvancedParams: () => Promise<AdvancedParams>;
  setAdvancedParams: (advancedParams: AdvancedParams) => Promise<boolean>;
}

export interface IElectronAnalysisHistoryAPI {
  getAnalysisHistory: () => Promise<AnalysisRecord[]>;
  saveAnalysisHistory: (history: AnalysisRecord[]) => Promise<boolean>;
  addAnalysisRecord: (record: AnalysisRecord) => Promise<boolean>;
  updateAnalysisStatus: (
    id: string,
    status: string,
    additionalData?: any,
  ) => Promise<boolean>;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
    electronFile: IElectronFileAPI;
    electronAnalysisHistory: IElectronAnalysisHistoryAPI;
  }
}
