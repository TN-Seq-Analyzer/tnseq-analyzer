import AnalysisHistoys from "@/pages/AnalysisHistoys";
import HomeScreen from "@/pages/HomeScreen";
import InteractiveAnalysisScreen from "@/pages/InteractiveAnalysisScreen";
import ProcessSampleSCreen from "@/pages/ProcessSampleScreen";
import { Route, Routes } from "react-router";

export default function RouterLayout() {
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/processSample" element={<ProcessSampleSCreen />} />
      <Route
        path="/interactiveAnalysis"
        element={<InteractiveAnalysisScreen />}
      />
      <Route path="/analysisHistory" element={<AnalysisHistoys />} />
    </Routes>
  );
}
