import { createContext, useContext, useState, ReactNode } from "react";

type AnalysisResult = any;

export type PipelineLogEntry = {
  timestamp: string;
  step: string;
  level: "INFO" | "ERROR" | "WARN" | "STDERR";
  text: string;
  progress?: number;
  success?: boolean;
};

interface AnalysisContextType {
  results: AnalysisResult | null;
  setResults: (results: AnalysisResult | null) => void;
  pipelineLogs: PipelineLogEntry[];
  appendPipelineLogs: (entries: PipelineLogEntry[] | PipelineLogEntry) => void;
  clearPipelineLogs: () => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(
  undefined,
);

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [pipelineLogs, setPipelineLogs] = useState<PipelineLogEntry[]>([]);

  const appendPipelineLogs = (
    entries: PipelineLogEntry[] | PipelineLogEntry,
  ) => {
    setPipelineLogs((prev) => prev.concat(entries as any));
  };

  const clearPipelineLogs = () => setPipelineLogs([]);

  return (
    <AnalysisContext.Provider
      value={{
        results,
        setResults,
        pipelineLogs,
        appendPipelineLogs,
        clearPipelineLogs,
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysisContext() {
  const context = useContext(AnalysisContext);
  if (context === undefined) {
    throw new Error(
      "useAnalysisContext must be used within an AnalysisProvider",
    );
  }
  return context;
}
