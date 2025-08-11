import { dialog } from "electron";
import fs from "fs";

export async function handleOpenFileDialogFastq() {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ["openFile"],
    filters: [{ name: "Fastq", extensions: ["fastq", "fastq.gz"] }],
  });

  if (canceled) return null;

  const filePath = filePaths[0];
  const fileContent = fs.readFileSync(filePath, "utf8");

  return { filePath, fileContent };
}

export async function handleOpenFileDialogGff() {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ["openFile"],
    filters: [{ name: "Gff", extensions: ["gff", "gff3"] }],
  });

  if (canceled) return null;

  const filePath = filePaths[0];
  const fileContent = fs.readFileSync(filePath, "utf8");

  return { filePath, fileContent };
}
