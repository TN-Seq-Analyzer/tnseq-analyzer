import { useState } from "react";

export function useFileHandler() {
  const [files, setFiles] = useState({
    fastq: { name: null, content: null },
    fasta: { name: null, content: null },
    gff: { name: null, content: null },
    directory: { directory: null },
  });
  const [transpFile, setTranspFile] = useState("");
  const [idFile, setIdFile] = useState("");

  const handleOpenFile = async (
    type: "fastq" | "gff" | "fasta",
    field: keyof typeof files,
  ) => {
    let dialogFn;
    switch (type) {
      case "fastq":
        dialogFn = window.electronFile.openFileDialogFastq;
        break;
      case "gff":
        dialogFn = window.electronFile.openFileDialogGff;
        break;
      case "fasta":
        dialogFn = window.electronFile.openFileDialogFasta;
        break;
      default:
        throw new Error("Tipo de arquivo não suportado");
    }
    const result = await dialogFn();
    if (result) {
      const { filePath, fileContent } = result;
      const fileAbs = filePath.split("\\");
      const fileName = fileAbs[fileAbs.length - 1] || "";
      setFiles((prev) => ({
        ...prev,
        [field]: { name: fileName, content: fileContent },
      }));
    }
  };

  const handleOpenFastq = (field: keyof typeof files) =>
    handleOpenFile("fastq", field);
  const handleOpenGff = (field: keyof typeof files) =>
    handleOpenFile("gff", field);
  const handleOpenFasta = (field: keyof typeof files) =>
    handleOpenFile("fasta", field);

  const handleOpenDirectory = async (
    field: keyof typeof files,
  ): Promise<void> => {
    const directory = await window.electronFile.openFileDialogDirectory();
    if (directory) {
      const { filePath } = directory;
      setFiles((prev) => ({
        ...prev,
        [field]: { directory: filePath },
      }));
    }
  };
  return {
    files,
    handleOpenFastq,
    handleOpenGff,
    handleOpenFasta,
    handleOpenDirectory,
    transpFile,
    setTranspFile,
    idFile,
    setIdFile,
  };
}
