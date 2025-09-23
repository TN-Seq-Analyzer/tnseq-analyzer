import { AnalysisRecord } from "@/utils/analysisHistoryFileUtils";
import { formatDate } from "@/utils/formatDate";
import { Button, Modal } from "antd";

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
  return (
    <Modal
      title="Detalhes da Análise"
      open={detailsModalVisible}
      onCancel={() => setDetailsModalVisible(false)}
      footer={[
        <Button key="close" onClick={() => setDetailsModalVisible(false)}>
          Fechar
        </Button>,
      ]}
    >
      {selectedAnalysis && (
        <div className="font-inter text-xs">
          <p>
            <strong>Projeto:</strong> {selectedAnalysis.projectName}
          </p>
          <p>
            <strong>Data:</strong> {formatDate(selectedAnalysis.date)}
          </p>
          <p>
            <strong>Status:</strong> {selectedAnalysis.status}
          </p>
          {selectedAnalysis.details && (
            <div>
              <h4 className="mt-3 font-semibold">Detalhes do erro:</h4>
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
