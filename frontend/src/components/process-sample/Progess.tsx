import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export function ProgressMock() {
  const [progress, setProgress] = useState(0);
  const { t } = useTranslation("translation", {
    keyPrefix: "content.processSample.analysis",
  });

  useEffect(() => {
    const timer = setTimeout(() => setProgress((prev) => prev), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <p className="mt-2 mb-1 text-xs font-medium text-[var(--text-primaryGray)]">
        {progress}% {t("complete")}
      </p>
      <Progress value={progress} className="h-2 w-[100%]" />
    </>
  );
}
