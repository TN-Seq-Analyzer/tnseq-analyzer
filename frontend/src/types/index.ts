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
