import { useEffect, useState } from "react";

export function useFileHandler() {
  const [files, setFiles] = useState({
    fastq: { name: null, content: null },
    fasta: { name: null, content: null },
    gff: { name: null, content: null },
    directory: { directory: null },
    transpFile: "",
    idFile: "",
  });

  useEffect(() => {
    async function fetchFiles() {
      if (window.electronFile?.getFiles) {
        const persisted = await window.electronFile.getFiles();
        if (persisted) {
          setFiles(persisted);
          setTranspFile(persisted.transpFile || "");
          setIdFile(persisted.idFile || "");
        }
      }
    }
    fetchFiles();
  }, []);
  const [transpFile, setTranspFile] = useState("");
  const [idFile, setIdFile] = useState("");

  const persistFiles = (updatedFiles: typeof files) => {
    if (window.electronFile?.setFiles) {
      window.electronFile.setFiles(updatedFiles);
    }
  };

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
      setFiles((prev) => {
        const updated = {
          ...prev,
          [field]: { name: fileName, content: fileContent },
        };
        persistFiles(updated);
        return updated;
      });
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
      setFiles((prev) => {
        const updated = {
          ...prev,
          [field]: { directory: filePath },
        };
        persistFiles(updated);
        return updated;
      });
    }
  };

  const updateTranspFile = (value: string) => {
    setTranspFile(value);
    setFiles((prev) => {
      const updated = { ...prev, transpFile: value };
      persistFiles(updated);
      return updated;
    });
  };

  const updateIdFile = (value: string) => {
    setIdFile(value);
    setFiles((prev) => {
      const updated = { ...prev, idFile: value };
      persistFiles(updated);
      return updated;
    });
  };

  return {
    files,
    handleOpenFastq,
    handleOpenGff,
    handleOpenFasta,
    handleOpenDirectory,
    transpFile,
    setTranspFile: updateTranspFile,
    idFile,
    setIdFile: updateIdFile,
  };
}
