import {
  getLastResult,
  subscribeToResults,
} from "@/services/processSampleService";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

function InteractiveAnalysisScreen() {
  const { t } = useTranslation("translation");
  const [results, setResults] = useState<any | null>(() => getLastResult());

  useEffect(() => {
    const unsubscribe = subscribeToResults((data) => {
      setResults(data);
    });
    return unsubscribe;
  }, []);

  console.log("InteractiveAnalysisScreen rendered");
  console.log(results);

  const displayed = results ?? null;

  return (
    <main className="flex flex-1 overflow-y-auto bg-[var(--bg-main)] px-8">
      <div className="mt-8 flex flex-1 flex-col gap-3">
        <section className="mt-4">
          <h2 className="font-poppins text-textPrimary text-md mb-2 font-bold">
            {t("content.interactiveAnalysis.resultTitle")}
          </h2>
          <div className="max-h-[60vh] overflow-auto rounded bg-white p-4 font-mono text-xs shadow-sm">
            {displayed ? (
              <>
                <pre className="mb-4">{JSON.stringify(displayed, null, 2)}</pre>
              </>
            ) : (
              <div className="text-[var(--text-primaryGray)]">
                {t("content.interactiveAnalysis.noResult")}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default InteractiveAnalysisScreen;
