import type { PipelineLogEntry } from "@/context/AnalysisContext";

type WsMessage = {
  success: boolean;
  data: {
    step: string;
    logs: string[];
    generated_files: string[];
    results: Record<string, any>;
    progress: number;
  };
};

function detectLevel(text: string): PipelineLogEntry["level"] {
  if (/^stderr:/i.test(text)) return "STDERR";
  if (/^error[:\s]/i.test(text)) return "ERROR";
  if (/^warn[:\s]/i.test(text)) return "WARN";
  return "INFO";
}

function stripPrefixes(text: string): string {
  return text.replace(/^stderr:\s*/i, "").trim();
}

export function parseWsChunkToEntries(raw: string): PipelineLogEntry[] {
  let msg: WsMessage | null = null;
  try {
    msg = JSON.parse(raw);
  } catch {
    return [
      {
        timestamp: new Date().toISOString(),
        step: "unknown",
        level: "INFO",
        text: raw,
      },
    ];
  }

  const ts = new Date().toISOString();
  const entries: PipelineLogEntry[] = [];
  const step = msg.data?.step || "unknown";
  const progress = msg.data?.progress;
  const success = msg.success;

  for (const line of msg.data?.logs ?? []) {
    const level = detectLevel(line);
    const text = stripPrefixes(line);
    entries.push({ timestamp: ts, step, level, text, progress, success });
  }

  if (entries.length === 0) {
    entries.push({
      timestamp: ts,
      step,
      level: "INFO",
      text: "",
      progress,
      success,
    });
  }

  return entries;
}

export function summarizeEntries(entries: PipelineLogEntry[]) {
  // exemplo de agregador futuro (nao usado diretamente agora)
  const last = entries[entries.length - 1];
  return {
    step: last?.step,
    progress: last?.progress,
    success: last?.success,
  };
}

export function isSuccessLine(text?: string) {
  if (!text) return false;
  return /(finished|success|successfully|completed)/i.test(text);
}

export function getSuccessSummary(entries: PipelineLogEntry[]): string {
  const infoSuccess = entries.find(
    (e) => e.level === "INFO" && isSuccessLine(e.text),
  );
  if (infoSuccess?.text) return infoSuccess.text;

  const anySuccess = entries.find((e) => isSuccessLine(e.text));
  if (anySuccess?.text) return anySuccess.text;

  for (let i = entries.length - 1; i >= 0; i--) {
    if (entries[i].level === "INFO" && entries[i].text) {
      return entries[i].text;
    }
  }

  const firstNonEmpty = entries.find((e) => (e.text || "").trim().length > 0);
  if (firstNonEmpty?.text) return firstNonEmpty.text;

  return "Step completed";
}
