import { useEffect, useState } from "react";
import { AdvancedParams } from "../types/index";

export function useInputAdvanced() {
  const [values, setValues] = useState<AdvancedParams>({
    minimumReadLength: "0",
    maximumReadLength: "0",
    trimmingQuality: "0",
    minimumMapingQuality: "0",
    numberOfThreadsForAnalysis: "0",
    minConfidenceThreshold: "0",
    maxNonEssentialGenes: "0",
  });

  useEffect(() => {
    async function fetchAdvancedParams() {
      if (window.electronFile?.getAdvancedParams) {
        const persisted = await window.electronFile.getAdvancedParams();
        if (persisted) {
          setValues(persisted);
        }
      }
    }
    fetchAdvancedParams();
  }, []);

  const persistAdvancedParams = (updatedParams: AdvancedParams) => {
    if (window.electronFile?.setAdvancedParams) {
      window.electronFile.setAdvancedParams(updatedParams);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const updatedValues: AdvancedParams = {
      ...values,
      [e.target.name]: newValue,
    };
    setValues(updatedValues);
    persistAdvancedParams(updatedValues);
  };

  return {
    values,
    onChange: handleChange,
  };
}
