import { useRef, useState } from "react";
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

  function startMockAnalysis() {
    if (isRunning) return;
    setIsRunning(true);
    setProgress(0);
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(intervalRef.current!);
          setIsRunning(false);
          toast.success(t("analysis.completeToast"));
          return 100;
        }
        return prev + Math.floor(Math.random() * 5);
      });
    }, 300);
  }

  return {
    progress,
    isRunning,
    startMockAnalysis,
    cancelAnalysis,
  };
}
