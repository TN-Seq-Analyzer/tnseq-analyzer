import type { FileData } from "@/types/index";

export type ProcessResult = any;

const BASE_URL = "http://127.0.0.1:5000";

export async function processFastq(
  files: FileData,
  adapter: string,
  outputDir?: string,
) {
  if (!files.fastq.content || !files.fastq.name) {
    throw new Error("Fastq file not provided");
  }

  const formData = new FormData();
  const blob = new Blob([files.fastq.content], { type: "text/plain" });
  formData.append("file", blob, files.fastq.name);
  formData.append("adapter", adapter);
  if (outputDir) {
    formData.append("output_dir", outputDir);
  }
  console.log("Output dir:", outputDir);

  const response = await fetch(`${BASE_URL}/process-fastq`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail);
  }

  const result = await response.json();

  return result;
}

export async function processTimGalore(files: FileData, outputDir?: string) {
  if (!files.fastq.content || !files.fastq.name) {
    throw new Error("Fastq file not provided");
  }

  const formData = new FormData();
  const blob = new Blob([files.fastq.content], { type: "text/plain" });
  formData.append("file", blob, files.fastq.name);
  if (outputDir) {
    formData.append("output_dir", outputDir);
  }

  const response = await fetch(`${BASE_URL}/process-trimgalore`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail);
  }

  const result = await response.json();

  return result;
}
