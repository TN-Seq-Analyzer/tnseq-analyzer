import { startJobAndStream } from "@/services/processSampleService";
import type { FileData } from "@/types/index";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  parseWsChunkToEntries,
  getSuccessSummary,
  isSuccessLine,
} from "@/utils/pipelineLogFormatter";
import { useAnalysisContext } from "@/context/AnalysisContext";

export function useAnalysis() {
  const { t } = useTranslation("translation", {
    keyPrefix: "content.processSample",
  });
  const [progress, setProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { appendPipelineLogs, clearPipelineLogs } = useAnalysisContext();
  const currentProjectNameRef = useRef<string>("");
  const abortRef = useRef<AbortController | null>(null);

  const genId = () =>
    Date.now().toString(36) + Math.random().toString(36).slice(2, 10);

  async function addHistoryRecord(
    status: "Completo" | "Erro" | "Cancelado",
    opts?: { projectName?: string; details?: any; results?: any },
  ) {
    try {
      const projectName =
        (opts?.projectName ?? currentProjectNameRef.current)?.trim() || "";
      const record = {
        id: genId(),
        date: new Date().toISOString(),
        projectName,
        status,
        ...(opts?.details ? { details: opts.details } : {}),
        ...(opts?.results ? { results: opts.results } : {}),
      } as const;
      await window.electronAnalysisHistory?.addAnalysisRecord(record as any);
    } catch (e) {
      console.error("Falha ao salvar histórico da análise:", e);
    }
  }

  function cancelAnalysis() {
    if (isRunning) {
      clearInterval(intervalRef.current!);
      setIsRunning(false);
      setProgress(0);
      toast.error(t("analysis.cancelledToast"));
      void addHistoryRecord("Cancelado");
      try {
        abortRef.current?.abort();
      } catch {}
      appendPipelineLogs({
        timestamp: new Date().toISOString(),
        step: "ANALYSIS",
        level: "WARN",
        text: t("analysis.cancelledToast"),
        success: false,
      });
    }
  }

  const persistLastProgress = (pct: number) => {
    try {
      window.electronFile?.getFiles?.().then((files) => {
        if (files) {
          window.electronFile?.setFiles?.({ ...files, lastProgress: pct });
        }
      });
    } catch {}
  };

  async function startAnalysis(files: FileData, transpSeq: string) {
    if (isRunning) return;

    const hasFastqPath = (files as any)?.fastq?.path;
    const hasFastaPath = (files as any)?.fasta?.path;
    if (!hasFastqPath) {
      toast.error(t("validation.noFastq"));
      return;
    }
    if (!hasFastaPath) {
      toast.error(t("validation.noFasta"));
      return;
    }
    if (!files.directory?.directory) {
      toast.error(t("validation.noDirectory"));
      return;
    }

    setIsRunning(true);
    setProgress(0);
    persistLastProgress(0);
    currentProjectNameRef.current = files.projectName || "";

    try {
      clearPipelineLogs();
      intervalRef.current = setInterval(() => {
        setProgress((prev) => Math.min(prev + 3, 90));
      }, 400);

      const controller = new AbortController();
      abortRef.current = controller;
      const streamResult = await startJobAndStream(
        files,
        {
          trimming: { trimmer: "trim_galore" },
          alignment: { index_prefix: "index" },
        },
        (msg: string) => {
          const entries = parseWsChunkToEntries(msg);

          const successLines = entries.filter((e) => isSuccessLine(e.text));
          if (successLines.length > 0) {
            appendPipelineLogs(successLines);
          } else {
            const successByStep = new Map<string, typeof entries>();
            for (const e of entries) {
              if (e.success) {
                if (!successByStep.has(e.step)) successByStep.set(e.step, []);
                successByStep.get(e.step)!.push(e);
              }
            }
            if (successByStep.size > 0) {
              const compactEntries = Array.from(successByStep.entries()).map(
                ([step, list]) => {
                  const summary = getSuccessSummary(list);
                  const base = list[list.length - 1];
                  return {
                    timestamp: base.timestamp,
                    step,
                    level: "INFO" as const,
                    text: summary,
                    progress: base.progress,
                    success: true,
                  };
                },
              );
              appendPipelineLogs(compactEntries);
            }
          }

          const lastWithProgress = entries.find(
            (e) => typeof e.progress === "number",
          );
          if (lastWithProgress?.progress != null) {
            const pct = Math.floor((lastWithProgress.progress as number) * 100);
            setProgress((prev) => Math.max(prev, Math.min(99, pct)));
            persistLastProgress(pct);
          }
        },
        controller.signal,
      );

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      setProgress(100);
      persistLastProgress(100);
      setIsRunning(false);
      abortRef.current = null;

      toast.success(t("analysis.completeToast"));
      await addHistoryRecord("Completo");

      return { jobId: streamResult.jobId, logs: streamResult.messages };
    } catch (error) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsRunning(false);
      setProgress(0);
      persistLastProgress(0);
      abortRef.current = null;

      if (error instanceof Error && error.message === "ABORTED") {
        setTimeout(() => {
          appendPipelineLogs({
            timestamp: new Date().toISOString(),
            step: "ANALYSIS",
            level: "WARN",
            text: t("analysis.cancelledToast"),
            success: false,
          });
        }, 0);
        return;
      }

      const errorMessage =
        error instanceof Error
          ? error.message
          : t("errors.analysisFailed", { message: "Erro desconhecido" });
      if (error instanceof Error) {
        toast.error(t("errors.analysisFailed", { message: error.message }));
      } else {
        toast.error(errorMessage);
      }

      const detail =
        error instanceof Error
          ? { errorMessage: error.message }
          : { errorMessage: String(errorMessage) };
      void addHistoryRecord("Erro", { details: detail });
    }
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  return {
    progress,
    isRunning,
    // startMockAnalysis,
    startAnalysis,
    cancelAnalysis,
  };
}
