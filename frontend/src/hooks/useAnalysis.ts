import {
  processFastq,
  processTimGalore,
  setLastResult,
} from "@/services/processSampleService";
import type { FileData } from "@/types/index";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export function useAnalysis() {
  const { t } = useTranslation("translation", {
    keyPrefix: "content.processSample",
  });
  const [progress, setProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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

    if (!files.fastq.content || !files.fastq.name) {
      toast.error(t("validation.noFastq"));
      return;
    }

    if (!transpSeq.trim()) {
      toast.error(t("validation.noTranspSeq"));
      return;
    }

    setIsRunning(true);
    setProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 5, 90));
      }, 200);

      const [fastqResult, trimGaloreResult] = await Promise.all([
        processFastq(files, transpSeq),
        processTimGalore(files),
      ]);

      clearInterval(progressInterval);

      setProgress(100);
      setIsRunning(false);
      console.log("Fastq Result:", fastqResult);
      console.log("Trim Galore Result:", trimGaloreResult);
      console.log("Updating lastResult");
      setLastResult({ fastqResult, trimGaloreResult });

      toast.success(t("analysis.completeToast"));
    } catch (error) {
      clearInterval(intervalRef.current!);
      setIsRunning(false);
      setProgress(0);

      const errorMessage =
        error instanceof Error
          ? error.message
          : t("errors.analysisFailed", { message: "Erro desconhecido" });
      // If error is an Error, use interpolation; else show generic message
      if (error instanceof Error) {
        toast.error(t("errors.analysisFailed", { message: error.message }));
      } else {
        toast.error(errorMessage);
      }
    }
  }

  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current!);
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
