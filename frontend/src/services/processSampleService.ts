import type { FileData } from "@/types/index";

export type ProcessResult = any;

const BASE_URL = "http://127.0.0.1:5000";

let subscribers: Array<(data: ProcessResult) => void> = [];
let lastResult: ProcessResult | null = null;

export function subscribeToResults(cb: (data: ProcessResult) => void) {
  subscribers.push(cb);
  if (lastResult !== null) {
    try {
      cb(lastResult);
    } catch (e) {}
  }
  return () => {
    subscribers = subscribers.filter((s) => s !== cb);
  };
}

export function getLastResult() {
  return lastResult;
}

export function setLastResult(result: ProcessResult) {
  lastResult = result;
  subscribers.forEach((cb) => cb(result));
}

export async function processFastq(files: FileData, adapter: string) {
  if (!files.fastq.content || !files.fastq.name) {
    throw new Error("Fastq file not provided");
  }

  const formData = new FormData();
  // converte pra arquivo pra nao ter o trabalho de refatorar as outras partes
  const blob = new Blob([files.fastq.content], { type: "text/plain" });
  formData.append("file", blob, files.fastq.name);
  formData.append("adapter", adapter);

  // nao adicionei o promiseAll pra nao dar b.o
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

export async function processTimGalore(files: FileData) {
  if (!files.fastq.content || !files.fastq.name) {
    throw new Error("Fastq file not provided");
  }

  const formData = new FormData();
  const blob = new Blob([files.fastq.content], { type: "text/plain" });
  formData.append("file", blob, files.fastq.name);

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
