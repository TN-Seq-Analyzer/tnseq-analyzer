import { AnalysisRecord } from "@/utils/analysisHistoryFileUtils";
import { formatDate } from "@/utils/formatDate";
import { Button, Modal } from "antd";

interface ModalShowDetailsProps {
  resultsModalVisible: boolean;
  setResultsModalVisible: (visible: boolean) => void;
  selectedAnalysis: AnalysisRecord | null;
}

function ModalShowResults({
  resultsModalVisible,
  setResultsModalVisible,
  selectedAnalysis,
}: ModalShowDetailsProps) {
  return (
    <Modal
      title="Resultados da Análise"
      open={resultsModalVisible}
      onCancel={() => setResultsModalVisible(false)}
      footer={[
        <Button key="close" onClick={() => setResultsModalVisible(false)}>
          Fechar
        </Button>,
      ]}
      width="80%"
      centered
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
          {selectedAnalysis.results && (
            <div className="mt-3 max-h-[400px] overflow-y-auto rounded-md bg-gray-50 p-3">
              <h4 className="mb-2 font-semibold">Resultados:</h4>
              <pre className="text-xs whitespace-pre-wrap">
                {JSON.stringify(selectedAnalysis.results, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}

export default ModalShowResults;
