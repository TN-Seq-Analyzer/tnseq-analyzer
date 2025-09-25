import type { FileData } from "@/types/index";

export type JobResponse = { job_id: string };

const HTTP_BASE_URL = "http://localhost:5000";
const WS_BASE_URL = "ws://localhost:5000";

type JobOptions = {
  trimming: { trimmer: string };
  alignment: { index_prefix: string };
};

function buildInputFiles(files: FileData): string[] {
  console.log(files, "filessssssssssssssssssssssssss");
  const paths: Array<string | null | undefined> = [
    (files as any)?.fastq?.path,
    (files as any)?.fasta?.path,
  ];
  return paths.filter((p): p is string => Boolean(p));
}

function getExtension(path: string): string {
  const parts = path.split(/[/\\]/).pop() || "";
  const segs = parts.split(".");
  if (segs.length <= 1) return "";
  return segs.slice(1).join(".").toLowerCase();
}

function validateInputFiles(inputFiles: string[]) {
  const map: Record<string, number> = {};
  for (const p of inputFiles) {
    const ext = getExtension(p);
    let fileType: "read" | "ref" | null = null;
    if (["fq", "fq.gz", "fastq", "fastq.gz"].includes(ext)) fileType = "read";
    if (["fa", "fna", "fasta"].includes(ext)) fileType = fileType ?? "ref";
    if (!fileType) {
      throw new Error(`Arquivo com extensão inválida: ${p}`);
    }
    map[fileType] = (map[fileType] || 0) + 1;
  }
  const reads = map["read"] || 0;
  const refs = map["ref"] || 0;
  if (reads < 1 || refs !== 1) {
    throw new Error(
      "A combinação de arquivos não é suportada. Selecione ao menos 1 FASTQ e exatamente 1 FASTA.",
    );
  }
}

export async function createJob(
  files: FileData,
  options?: Partial<JobOptions>,
): Promise<JobResponse> {
  const inputFiles = buildInputFiles(files);
  if (inputFiles.length === 0) {
    throw new Error("Nenhum caminho de arquivo foi informado");
  }

  validateInputFiles(inputFiles);
  console.log("executado");

  const outputDir = files.directory?.directory;
  if (!outputDir) {
    throw new Error("Diretório de saída não informado");
  }

  const body = {
    input_files: inputFiles,
    output_dir: outputDir,
    options: {
      trimming: { trimmer: options?.trimming?.trimmer ?? "trim_galore" },
      alignment: { index_prefix: options?.alignment?.index_prefix ?? "index" },
    },
  };

  try {
    console.debug("[HTTP] POST /jobs payload:", body);
  } catch {}

  const response = await fetch(`${HTTP_BASE_URL}/jobs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let detail = "";
    try {
      const text = await response.clone().text();
      console.debug("[HTTP] /jobs failed:", response.status, text);
    } catch {}
    try {
      const asJson = await response.json();
      detail = asJson?.detail || JSON.stringify(asJson);
    } catch {
      try {
        detail = await response.text();
      } catch {
        detail = "Erro ao criar job";
      }
    }
    throw new Error(`[${response.status}] ${detail || "Falha ao criar job"}`);
  }

  const result = (await response.json()) as JobResponse;
  return result;
}

export type JobStreamResult = {
  jobId: string;
  messages: string[];
};

export async function startJobAndStream(
  files: FileData,
  options?: Partial<JobOptions>,
  onMessage?: (msg: string) => void,
): Promise<JobStreamResult> {
  const { job_id } = await createJob(files, options);

  return new Promise<JobStreamResult>((resolve, reject) => {
    const ws = new WebSocket(`${WS_BASE_URL}/jobs/${job_id}`);
    const messages: string[] = [];

    ws.onopen = () => {
      console.log(`[WS] Conexão aberta para job ${job_id}`);
    };

    ws.onmessage = (event) => {
      try {
        const maybeObj = JSON.parse(event.data);
        const text =
          typeof maybeObj === "string" ? maybeObj : JSON.stringify(maybeObj);
        messages.push(text);
        console.log(`[WS][${job_id}]`, text);
        onMessage?.(text);
      } catch {
        messages.push(String(event.data));
        console.log(`[WS][${job_id}]`, String(event.data));
        onMessage?.(String(event.data));
      }
    };

    ws.onerror = (err) => {
      console.error(`[WS] Erro no job ${job_id}:`, err);
      reject(new Error("Erro na conexão WebSocket"));
    };

    ws.onclose = () => {
      console.log(`[WS] Conexão encerrada para job ${job_id}`);
      resolve({ jobId: job_id, messages });
    };
  });
}
