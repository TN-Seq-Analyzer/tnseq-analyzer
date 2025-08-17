// Types for file management
export interface FileData {
  fastq: { name: string | null; content: string | null };
  fasta: { name: string | null; content: string | null };
  gff: { name: string | null; content: string | null };
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
