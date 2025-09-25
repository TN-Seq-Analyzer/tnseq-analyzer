import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import type { FileData } from "@/types";

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

  useEffect(() => {
    (async () => {
      try {
        const files: FileData | undefined =
          await window.electronFile?.getFiles?.();
        if (files) {
          setResults(files.analysisResult ?? null);
          setPipelineLogs(
            Array.isArray(files.pipelineLogs) ? files.pipelineLogs : [],
          );
        }
      } catch (e) {
        console.error(
          "Falha ao carregar estado persistido do processamento:",
          e,
        );
      }
    })();
  }, []);

  const appendPipelineLogs = (
    entries: PipelineLogEntry[] | PipelineLogEntry,
  ) => {
    setPipelineLogs((prev) => {
      const next = prev.concat(entries as any);
      try {
        window.electronFile?.getFiles?.().then((files) => {
          if (files) {
            const updated: FileData = { ...files, pipelineLogs: next };
            window.electronFile?.setFiles?.(updated);
          }
        });
      } catch {}
      return next;
    });
  };

  const clearPipelineLogs = () => {
    setPipelineLogs([]);
    try {
      window.electronFile?.getFiles?.().then((files) => {
        if (files) {
          const updated: FileData = { ...files, pipelineLogs: [] };
          window.electronFile?.setFiles?.(updated);
        }
      });
    } catch {}
  };

  return (
    <AnalysisContext.Provider
      value={{
        results,
        setResults: (r: AnalysisResult | null) => {
          setResults(r);
          try {
            window.electronFile?.getFiles?.().then((files) => {
              if (files) {
                const updated: FileData = { ...files, analysisResult: r };
                window.electronFile?.setFiles?.(updated);
              }
            });
          } catch {}
        },
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
