import { AnalysisRecord } from "@/utils/analysisHistoryFileUtils";
import { formatDate } from "@/utils/formatDate";
import { Button, Modal } from "antd";
import { useTranslation } from "react-i18next";

interface ModalShowResultsProps {
  resultsModalVisible: boolean;
  setResultsModalVisible: (visible: boolean) => void;
  selectedAnalysis: AnalysisRecord | null;
}

function ModalShowResults({
  resultsModalVisible,
  setResultsModalVisible,
  selectedAnalysis,
}: ModalShowResultsProps) {
  const { t } = useTranslation("translation", {
    keyPrefix: "content.analysisHistory.modal.results",
  });

  return (
    <Modal
      title={t("title")}
      open={resultsModalVisible}
      onCancel={() => setResultsModalVisible(false)}
      footer={[
        <Button key="close" onClick={() => setResultsModalVisible(false)}>
          {t("close")}
        </Button>,
      ]}
    >
      {selectedAnalysis && (
        <div className="flex flex-col gap-3">
          <p>
            <span className="font-bold">{t("projectName")}: </span>
            {selectedAnalysis.projectName}
          </p>
          <p>
            <span className="font-bold">{t("date")}: </span>
            {selectedAnalysis.date}
          </p>
          <p>
            <strong>Status:</strong> {selectedAnalysis.status}
          </p>
          {selectedAnalysis.results ? (
            <div className="mt-3 max-h-[400px] overflow-y-auto rounded-md bg-gray-50 p-3">
              <h4 className="mb-2 font-semibold">Resultados:</h4>
              <pre className="text-xs whitespace-pre-wrap">
                {JSON.stringify(selectedAnalysis.results, null, 2)}
              </pre>
            </div>
          ) : (
            <p className="text-sm text-gray-500">{t("noSummary")}</p>
          )}
        </div>
      )}
    </Modal>
  );
}

export default ModalShowResults;
