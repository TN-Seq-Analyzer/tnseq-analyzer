import HomeScreen from "@/pages/HomeScreen";
import ProcessSampleSCreen from "@/pages/ProcessSampleScreen";
import { Route, Routes } from "react-router";

export default function RouterLayout() {
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/processSample" element={<ProcessSampleSCreen />} />
    </Routes>
  );
}
