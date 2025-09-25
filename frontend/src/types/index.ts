export interface FileDataFileField {
  name: string | null;
  content: string | null;
  path?: string | null;
}

export interface FileData {
  projectName: string;
  fastq: FileDataFileField;
  fasta: FileDataFileField;
  gff: FileDataFileField;
  directory: { directory: string | null };
  transpFile: string;
  idFile: string;
  advancedParams: AdvancedParams;
  pipelineLogs?: PipelineLogEntry[];
  analysisResult?: any;
  lastProgress?: number;
}

export interface AdvancedParams {
  minimumReadLength: number;
  maximumReadLength: number;
  trimmingQuality: number;
  minimumMapingQuality: number;
  numberOfThreadsForAnalysis: number;
  minConfidenceThreshold: number;
  maxNonEssentialGenes: number;
}

export interface Settings {
  language: string;
}

export interface FileDialogResult {
  filePath: string;
  fileContent?: string;
}

export type PipelineLogEntry = {
  timestamp: string;
  step: string;
  level: "INFO" | "ERROR" | "WARN" | "STDERR";
  text: string;
  progress?: number;
  success?: boolean;
};
