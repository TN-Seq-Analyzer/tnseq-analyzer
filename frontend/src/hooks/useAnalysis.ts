import { startJobAndStream } from "@/services/processSampleService";
import type { FileData } from "@/types/index";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { parseWsChunkToEntries } from "@/utils/pipelineLogFormatter";
import { useAnalysisContext } from "@/context/AnalysisContext";

export function useAnalysis() {
  const { t } = useTranslation("translation", {
    keyPrefix: "content.processSample",
  });
  const [progress, setProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { appendPipelineLogs, clearPipelineLogs } = useAnalysisContext();

  function cancelAnalysis() {
    if (isRunning) {
      clearInterval(intervalRef.current!);
      setIsRunning(false);
      setProgress(0);
      toast.error(t("analysis.cancelledToast"));
    }
  }

  // function startMockAnalysis() {
  //   if (isRunning) return;
  //   setIsRunning(true);
  //   setProgress(0);
  //   intervalRef.current = setInterval(() => {
  //     setProgress((prev) => {
  //       if (prev >= 100) {
  //         clearInterval(intervalRef.current!);
  //         setIsRunning(false);
  //         toast.success(t("analysis.completeToast"));
  //         return 100;
  //       }
  //       return prev + Math.floor(Math.random() * 5);
  //     });
  //   }, 300);
  // }

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

    try {
      clearPipelineLogs();
      intervalRef.current = setInterval(() => {
        setProgress((prev) => Math.min(prev + 3, 90));
      }, 400);

      // Inicia o job e abre WebSocket para stream
      const streamResult = await startJobAndStream(
        files,
        {
          trimming: { trimmer: "trim_galore" },
          alignment: { index_prefix: "index" },
        },
        (msg: string) => {
          const entries = parseWsChunkToEntries(msg);
          appendPipelineLogs(entries);
          const lastWithProgress = entries.find(
            (e) => typeof e.progress === "number",
          );
          if (lastWithProgress?.progress != null) {
            const pct = Math.floor((lastWithProgress.progress as number) * 100);
            setProgress((prev) => Math.max(prev, Math.min(99, pct)));
          }
        },
      );

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      setProgress(100);
      setIsRunning(false);

      toast.success(t("analysis.completeToast"));
      return { jobId: streamResult.jobId, logs: streamResult.messages };
    } catch (error) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsRunning(false);
      setProgress(0);

      const errorMessage =
        error instanceof Error
          ? error.message
          : t("errors.analysisFailed", { message: "Erro desconhecido" });
      if (error instanceof Error) {
        toast.error(t("errors.analysisFailed", { message: error.message }));
      } else {
        toast.error(errorMessage);
      }
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
