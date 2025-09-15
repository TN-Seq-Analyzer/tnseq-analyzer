import { app } from "electron";
import fs from "fs";
import path from "node:path";
import { AdvancedParams, FileData } from "../types/index";

const getFilesPath = (): string => {
  const userDataPath = app.getPath("userData");
  return path.join(userDataPath, "files.json");
};

const getDefaultFileData = (): FileData => ({
  projectName: "",
  fastq: { name: null, content: null },
  fasta: { name: null, content: null },
  gff: { name: null, content: null },
  directory: { directory: null },
  transpFile: "",
  idFile: "",
  advancedParams: {
    minimumReadLength: 0,
    maximumReadLength: 0,
    trimmingQuality: 0,
    minimumMapingQuality: 0,
    numberOfThreadsForAnalysis: 0,
    minConfidenceThreshold: 0,
    maxNonEssentialGenes: 0,
  },
});

const getDefaultAdvancedParams = (): AdvancedParams => ({
  minimumReadLength: 0,
  maximumReadLength: 0,
  trimmingQuality: 0,
  minimumMapingQuality: 0,
  numberOfThreadsForAnalysis: 0,
  minConfidenceThreshold: 0,
  maxNonEssentialGenes: 0,
});

export const loadFiles = (): FileData => {
  try {
    const filesPath = getFilesPath();
    if (fs.existsSync(filesPath)) {
      const data = fs.readFileSync(filesPath, "utf8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error loading files:", error);
  }
  return getDefaultFileData();
};

export const saveFiles = (files: FileData): void => {
  try {
    const filesPath = getFilesPath();
    fs.writeFileSync(filesPath, JSON.stringify(files, null, 2));
  } catch (error) {
    console.error("Error saving files:", error);
  }
};

export const getAdvancedParams = (): AdvancedParams => {
  const files = loadFiles();
  return files.advancedParams || getDefaultAdvancedParams();
};

export const setAdvancedParams = (advancedParams: AdvancedParams): boolean => {
  try {
    const files = loadFiles();
    files.advancedParams = advancedParams;
    saveFiles(files);
    return true;
  } catch (error) {
    console.error("Error saving advanced params:", error);
    return false;
  }
};

export const createNewProject = (name: string): void => {
  try {
    const data = getDefaultFileData();
    data.projectName = name;
    saveFiles(data);
  } catch (error) {
    console.error("Erro ao criar novo projeto:", error);
  }
};

export const setProjectName = (name: string): boolean => {
  try {
    const files = loadFiles();
    files.projectName = name;
    saveFiles(files);
    return true;
  } catch (error) {
    console.error("Erro ao salvar nome do projeto:", error);
    return false;
  }
};

export const exportProjectToPath = (destPath: string): boolean => {
  try {
    const files = loadFiles();
    const projectName =
      files.projectName && files.projectName.trim() !== "" && files.projectName;

    const finalPath = destPath.endsWith(".json")
      ? destPath
      : path.join(destPath, `${projectName}.json`);
    fs.writeFileSync(finalPath, JSON.stringify(files, null, 2));
    return true;
  } catch (error) {
    console.error("Erro ao exportar projeto:", error);
    return false;
  }
};
