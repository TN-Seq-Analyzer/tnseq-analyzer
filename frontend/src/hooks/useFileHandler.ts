import { useState } from "react";

export function useFileHandler() {
  const [files, setFiles] = useState({
    fastq: { name: null, content: null },
    fasta: { name: null, content: null },
    gff: { name: null, content: null },
  });
  const [transpFile, setTranspFile] = useState("");
  const [idFile, setIdFile] = useState("");

  const handleOpenFastq = async (field: keyof typeof files) => {
    const result = await window.electronFile.openFileDialogFastq();
    if (result) {
      const { filePath, fileContent } = result;
      const fileName = filePath.split("/").pop() || "";
      setFiles((prev) => ({
        ...prev,
        [field]: { name: fileName, content: fileContent },
      }));
    }
  };
  const handleOpenGff = async (field: keyof typeof files) => {
    const result = await window.electronFile.openFileDialogGff();
    if (result) {
      const { filePath, fileContent } = result;
      const fileName = filePath.split("/").pop() || "";
      setFiles((prev) => ({
        ...prev,
        [field]: { name: fileName, content: fileContent },
      }));
    }
  };

  return {
    files,
    handleOpenFastq,
    handleOpenGff,
    transpFile,
    setTranspFile,
    idFile,
    setIdFile,
  };
}
