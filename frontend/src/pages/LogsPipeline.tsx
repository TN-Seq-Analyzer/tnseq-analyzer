import React, { useEffect, useMemo, useRef } from "react";
import { useAnalysisContext } from "@/context/AnalysisContext";
import Title from "@/components/Title";
import { isSuccessLine } from "@/utils/pipelineLogFormatter";

const LogsPipeline: React.FC = () => {
  const { pipelineLogs } = useAnalysisContext();
  const logsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop =
        logsContainerRef.current.scrollHeight;
    }
  }, [pipelineLogs]);
  const successEvents = useMemo(() => {
    const items = pipelineLogs
      .filter((e) => e.success || isSuccessLine(e.text))
      .map((e) => ({
        step: e.step,
        time: new Date(e.timestamp).toLocaleTimeString(),
        ts: new Date(e.timestamp).getTime(),
        text: e.text,
        level: e.level,
      }));
    items.sort((a, b) => a.ts - b.ts);
    return items;
  }, [pipelineLogs]);

  return (
    <main className="flex flex-1 overflow-hidden bg-[var(--bg-main)] px-8 py-8 select-none">
      <div className="w-full">
        <Title titleValue="pipelineLog" />

        <div
          ref={logsContainerRef}
          className="mt-5 h-[calc(100vh-150px)] overflow-auto rounded border border-gray-200 bg-white p-3 font-mono text-sm whitespace-pre-wrap"
        >
          {successEvents.length === 0 && (
            <div className="text-gray-500">
              Nenhuma etapa concluída ainda...
            </div>
          )}
          {successEvents.map((row, index) => (
            <div key={index} className="mb-2">
              <span className="text-gray-500">{row.time} -</span>{" "}
              <span className="font-semibold">{row.step}</span>{" "}
              <span className="font-semibold text-green-700">[INFO]</span>{" "}
              <span>{row.text}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default LogsPipeline;
