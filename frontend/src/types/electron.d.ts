export interface IElectronAPI {
  getLanguage: () => Promise<string>
  setLanguage: (language: string) => Promise<string>
}

declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}
