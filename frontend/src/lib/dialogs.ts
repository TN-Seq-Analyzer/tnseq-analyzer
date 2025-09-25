import { dialog } from "electron";
import fs from "fs";

export async function openDialog(
  type: "fastq" | "gff" | "fasta" | "directory",
) {
  let properties: Array<"openFile" | "openDirectory"> = ["openFile"];
  let filters: Array<{ name: string; extensions: string[] }> = [];
  let readContent = true;

  switch (type) {
    case "fastq":
      filters = [{ name: "Fastq", extensions: ["fastq", "fastq.gz", "fq"] }];
      break;
    case "gff":
      filters = [{ name: "Gff", extensions: ["gff", "gff3"] }];
      break;
    case "fasta":
      filters = [{ name: "Fasta", extensions: ["fasta", "fa"] }];
      readContent = false;
      break;
    case "directory":
      properties = ["openDirectory"];
      filters = [];
      readContent = false;
      break;
    default:
      throw new Error("Tipo não suportado");
  }

  let dialogOptions: any = { properties };
  if (filters.length > 0) {
    dialogOptions.filters = filters;
  }

  const { canceled, filePaths } = await dialog.showOpenDialog(dialogOptions);
  if (canceled || !filePaths.length) return null;
  const filePath = filePaths[0];

  if (readContent) {
    const fileContent = fs.readFileSync(filePath, "utf8");
    return { filePath, fileContent };
  }
  return { filePath };
}

export async function handleOpenFileDialogFastq() {
  return openDialog("fastq");
}
export async function handleOpenFileDialogGff() {
  return openDialog("gff");
}
export async function handleOpenFileDialogFasta() {
  return openDialog("fasta");
}
export async function handleOpenFileDialogDirectory() {
  return openDialog("directory");
}
