import React, { useEffect, useRef } from "react";
import { useAnalysisContext } from "@/context/AnalysisContext";
import Title from "@/components/Title";

const LogsPipeline: React.FC = () => {
  const { pipelineLogs } = useAnalysisContext();
  const logsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop =
        logsContainerRef.current.scrollHeight;
    }
  }, [pipelineLogs]);
  return (
    <main className="flex flex-1 overflow-hidden bg-[var(--bg-main)] px-8 py-8 select-none">
      <div className="w-full">
        <Title titleValue="pipelineLog" />

        <div
          ref={logsContainerRef}
          className="mt-5 h-[calc(100vh-150px)] overflow-auto rounded border border-gray-200 bg-white p-3 font-mono text-sm whitespace-pre-wrap"
        >
          {pipelineLogs.map((log, index) => {
            const colorClass =
              log.level === "ERROR"
                ? "text-red-600"
                : log.level === "WARN"
                  ? "text-amber-600"
                  : log.level === "STDERR"
                    ? "text-purple-700"
                    : "text-green-700";
            const value = Math.max(
              0,
              Math.min(100, Math.floor(((log.progress ?? 0) as number) * 100)),
            );
            return (
              <div key={index} className="mb-2">
                <span className="text-gray-500">
                  {new Date(log.timestamp).toLocaleTimeString()} -
                </span>{" "}
                <span className="font-semibold">{log.step}</span>{" "}
                <span className={`font-semibold ${colorClass}`}>
                  [{log.level}]
                </span>{" "}
                <span>{log.text}</span>
                {/* {typeof log.progress === "number" && (
                  <div className="mt-1 h-2 w-full rounded bg-gray-200">
                    <div
                      className="h-2 rounded bg-blue-500 transition-all"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                )} */}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
};

export default LogsPipeline;
