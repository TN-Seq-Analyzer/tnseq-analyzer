import { AnalysisRecord } from "@/utils/analysisHistoryFileUtils";
import { formatDate } from "@/utils/formatDate";
import { Button, Modal } from "antd";
import { useTranslation } from "react-i18next";

interface ModalShowDetailsProps {
  detailsModalVisible: boolean;
  setDetailsModalVisible: (visible: boolean) => void;
  selectedAnalysis: AnalysisRecord | null;
}

function ModalShowDetails({
  detailsModalVisible,
  setDetailsModalVisible,
  selectedAnalysis,
}: ModalShowDetailsProps) {
  const { t } = useTranslation("translation", {
    keyPrefix: "content.analysisHistory.modal.details",
  });

  return (
    <Modal
      title={t("title")}
      open={detailsModalVisible}
      onCancel={() => setDetailsModalVisible(false)}
      footer={[
        <Button key="close" onClick={() => setDetailsModalVisible(false)}>
          {t("close")}
        </Button>,
      ]}
    >
      {selectedAnalysis && (
        <div className="font-inter text-xs">
          <p>
            <span className="font-bold">{t("projectName")}: </span>
            {selectedAnalysis.projectName}
          </p>
          <p>
            <span className="font-bold">{t("date")}: </span>
            {selectedAnalysis.date}
          </p>
          <p>
            <span className="font-bold">{t("status")}: </span>
            {selectedAnalysis.status}
          </p>
          {selectedAnalysis.details && (
            <div>
              <h4 className="mt-3 font-semibold">{t("errorDetails")}</h4>
              <p className="text-red-500">
                {selectedAnalysis.details.errorMessage ||
                  JSON.stringify(selectedAnalysis.details)}
              </p>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}

export default ModalShowDetails;
