import { Progress } from "@/components/ui/progress";
import { useTranslation } from "react-i18next";

export function ProgressMock({ progress }: { progress: number }) {
  const { t } = useTranslation("translation", {
    keyPrefix: "content.processSample.analysis",
  });

  return (
    <>
      <p className="mt-2 mb-1 text-xs font-medium text-[var(--text-primaryGray)]">
        {progress <= 100 ? progress : 100}% {t("complete")}
      </p>
      <Progress value={progress} max={100} className="h-2 w-full" />
    </>
  );
}
