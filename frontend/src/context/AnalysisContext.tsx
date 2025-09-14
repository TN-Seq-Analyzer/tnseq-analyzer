import { createContext, useContext, useState, ReactNode } from "react";

type AnalysisResult = any;

interface AnalysisContextType {
  results: AnalysisResult | null;
  setResults: (results: AnalysisResult | null) => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(
  undefined,
);

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [results, setResults] = useState<AnalysisResult | null>(null);

  return (
    <AnalysisContext.Provider value={{ results, setResults }}>
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
