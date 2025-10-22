import React, { useState, useEffect } from "react";
import { Modal, Button, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { AnalysisRecord } from "../utils/analysisHistoryFileUtils";
import { formatDate } from "@/utils/formatDate";
import ModalShowDetails from "@/components/analysis-historys/ModalShowDetails";
import ModalShowResults from "@/components/analysis-historys/ModalShowResults";
import SearchBar from "@/components/analysis-historys/SearchBar";
import { useTranslation } from "react-i18next";

function AnalysisHistory() {
  const { t } = useTranslation("translation", {
    keyPrefix: "content.analysisHistory",
  });

  const [analysisHistory, setAnalysisHistory] = useState<AnalysisRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [resultsModalVisible, setResultsModalVisible] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] =
    useState<AnalysisRecord | null>(null);
  const [loading, setLoading] = useState(true);

  const statusClasses = {
    Completo: "text-green-400",
    Erro: "text-red-500",
    Cancelado: "text-yellow-500",
    default: "text-gray-700",
  };

  const statusKeyMap: Record<string, string> = {
    Completo: "completed",
    Erro: "error",
    Cancelado: "canceled",
  };

  const displayStatus = (status: string) =>
    t(`status.${statusKeyMap[status] || "unknown"}`);

  const classesStyleTable =
    "font-inter border-b-2 border-gray-200 bg-[#667582] px-4 py-3 text-left text-xs font-semibold text-white";

  useEffect(() => {
    const loadAnalysisHistory = async () => {
      try {
        setLoading(true);
        const history =
          await window.electronAnalysisHistory.getAnalysisHistory();

        if (history && history.length > 0) {
          setAnalysisHistory(history);
        }
      } catch (error) {
        console.error("Erro ao carregar histórico de análises:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalysisHistory();
  }, []);

  // const saveAnalysisRecord = async (record: AnalysisRecord) => {
  //   try {
  //     const newHistory = [...analysisHistory, record];
  //     setAnalysisHistory(newHistory);
  //     await window.electronAnalysisHistory.saveAnalysisHistory(newHistory);
  //   } catch (error) {
  //     console.error("Erro ao salvar registro de análise:", error);
  //   }
  // };

  const filteredHistory = analysisHistory.filter(
    (record) =>
      (record.projectName &&
        record.projectName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      record.date.includes(searchTerm),
  );

  const showDetails = (analysis: AnalysisRecord) => {
    setSelectedAnalysis(analysis);
    setDetailsModalVisible(true);
  };

  const showResults = (analysis: AnalysisRecord) => {
    setSelectedAnalysis(analysis);
    setResultsModalVisible(true);
  };

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="font-inter text-xs">{t("loading")}</p>
      </div>
    );
  }

  return (
    <main className="flex flex-1 overflow-y-auto bg-[var(--bg-main)] px-8 py-8 select-none lg:py-12 lg:pl-10">
      <div className="flex h-full w-full flex-col">
        <h1 className="font-inter mb-2 text-xl font-bold">{t("title")}</h1>
        <p className="font-inter mb-5 text-xs font-light text-gray-600">
          {t("description")}
        </p>

        <SearchBar setSearchTerm={setSearchTerm} />

        <div
          className={`w-full ${filteredHistory.length > 0 && "flex-grow rounded-xl shadow-md"} `}
        >
          <div
            className="h-[calc(100vh-250px)] overflow-y-auto rounded-xl"
            style={{ display: "block" }}
          >
            <table className="w-full table-fixed border-collapse">
              <thead className="sticky top-0 z-10">
                <tr>
                  <th className={classesStyleTable}>{t("table.date")}</th>
                  <th className={classesStyleTable}>
                    {t("table.projectName")}
                  </th>
                  <th className={classesStyleTable}>{t("table.status")}</th>
                  <th className={classesStyleTable}>{t("table.actions")}</th>
                </tr>
              </thead>
              {filteredHistory.length === 0 && (
                <tbody>
                  <tr>
                    <td
                      colSpan={4}
                      className="font-inter border-b border-gray-300 px-4 py-3 text-center text-xs"
                    >
                      {t("noResults")}
                    </td>
                  </tr>
                </tbody>
              )}
              {filteredHistory.length > 0 && (
                <tbody className="overflow-y-auto">
                  {filteredHistory.map((analysis) => (
                    <tr key={analysis.id}>
                      <td className="font-inter border-b border-gray-300 px-4 py-3 text-xs">
                        {formatDate(analysis.date)}
                      </td>
                      <td className="font-inter border-b border-gray-300 px-4 py-3 text-xs">
                        {analysis.projectName}
                      </td>
                      <td className="border-b border-gray-300 px-4 py-3">
                        <span
                          className={
                            `font-inter inline-block w-full rounded-md border-[1px] px-3 py-1 text-center text-xs ` +
                            statusClasses[analysis.status]
                          }
                        >
                          {displayStatus(analysis.status)}
                        </span>
                      </td>
                      <td className="border-b border-gray-300 px-4 py-3">
                        {analysis.status === "Completo" ? (
                          <button
                            className="font-inter text-textPrimary cursor-pointer border-none bg-transparent px-0 py-1 text-xs hover:underline"
                            onClick={() => showResults(analysis)}
                          >
                            {t("actions.viewResults")}
                          </button>
                        ) : analysis.status === "Erro" ? (
                          <button
                            className="font-inter text-textPrimary cursor-pointer border-none bg-transparent px-0 py-1 text-xs hover:underline"
                            onClick={() => showDetails(analysis)}
                          >
                            {t("actions.viewDetails")}
                          </button>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>
        </div>
        <ModalShowDetails
          detailsModalVisible={detailsModalVisible}
          setDetailsModalVisible={setDetailsModalVisible}
          selectedAnalysis={selectedAnalysis}
        />
        <ModalShowResults
          resultsModalVisible={resultsModalVisible}
          setResultsModalVisible={setResultsModalVisible}
          selectedAnalysis={selectedAnalysis}
        />
      </div>
    </main>
  );
}

export default AnalysisHistory;
