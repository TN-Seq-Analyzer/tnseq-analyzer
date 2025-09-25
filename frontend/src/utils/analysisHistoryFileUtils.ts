import { app } from "electron";
import fs from "fs";
import path from "node:path";

export type AnalysisStatus = "Completo" | "Cancelado" | "Erro";

export interface AnalysisRecord {
  id: string;
  date: string;
  projectName: string;
  status: AnalysisStatus;
  details?: any;
  results?: any;
}

const getAnalysisHistoryPath = (): string => {
  const userDataPath = app.getPath("userData");
  return path.join(userDataPath, "analysis-history.json");
};

export const getAnalysisHistory = (): AnalysisRecord[] => {
  try {
    const historyPath = getAnalysisHistoryPath();
    if (fs.existsSync(historyPath)) {
      const data = fs.readFileSync(historyPath, "utf8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Erro ao carregar histórico de análises:", error);
  }
  return [];
};

export const saveAnalysisHistory = (history: AnalysisRecord[]): void => {
  try {
    const historyPath = getAnalysisHistoryPath();
    fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));
  } catch (error) {
    console.error("Erro ao salvar histórico de análises:", error);
  }
};

export const addAnalysisRecord = (record: AnalysisRecord): void => {
  const currentHistory = getAnalysisHistory();
  const newHistory = [record, ...currentHistory];
  saveAnalysisHistory(newHistory);
};

export const updateAnalysisStatus = (
  id: string,
  status: AnalysisStatus,
  additionalData?: { details?: any; results?: any },
): void => {
  const currentHistory = getAnalysisHistory();
  const updatedHistory = currentHistory.map((record) => {
    if (record.id === id) {
      return {
        ...record,
        status,
        ...(additionalData?.details ? { details: additionalData.details } : {}),
        ...(additionalData?.results ? { results: additionalData.results } : {}),
      };
    }
    return record;
  });
  saveAnalysisHistory(updatedHistory);
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};
