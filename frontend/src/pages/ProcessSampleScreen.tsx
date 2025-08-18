import Description from "@/components/Description";
import ChooseFile from "@/components/process-sample/ChooseFile";
import InputAdvanced from "@/components/process-sample/InputAdvanced";
import InputManual from "@/components/process-sample/InputManual";
import { ProgressMock } from "@/components/process-sample/Progess";
import Title from "@/components/Title";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useAnalysis } from "@/hooks/useAnalysis";
import { useFileHandler } from "@/hooks/useFileHandler";
import { useInputAdvanced } from "@/hooks/useInputAdvanced";
import { useTranslation } from "react-i18next";

function ProcessSampleScreen() {
  const { t } = useTranslation("translation", {
    keyPrefix: "content.processSample",
  });
  const {
    progress,
    isRunning,
    // startMockAnalysis,
    startAnalysis,
    cancelAnalysis,
  } = useAnalysis();
  const { values, onChange } = useInputAdvanced();

  const {
    files,
    handleOpenFastq,
    handleOpenGff,
    handleOpenFasta,
    handleOpenDirectory,
    transpFile,
    setTranspFile,
    idFile,
    setIdFile,
  } = useFileHandler();

  const handleStartAnalysis = () => {
    startAnalysis(files, transpFile);
  };

  return (
    <main className="flex flex-1 overflow-y-auto bg-[var(--bg-main)] pl-8 select-none lg:py-12 lg:pl-10">
      <div className="mt-8 flex min-h-screen flex-1 flex-col gap-3">
        <Title titleValue="processSample" />
        <Description descriptionValue="processSample" />
        <ChooseFile
          defaultFileName="fastq"
          disabled
          handleOpen={() => handleOpenFastq("fastq")}
          fileName={files.fastq.name}
        />
        <ChooseFile
          defaultFileName="fasta"
          disabled
          fileName={files.fasta.name}
          handleOpen={() => handleOpenFasta("fasta")}
        />
        <ChooseFile
          defaultFileName="gff"
          disabled
          handleOpen={() => handleOpenGff("gff")}
          fileName={files.gff.name}
          disabledButton
        />
        <InputManual
          defaultFileName="sequenceTransp"
          value={transpFile}
          setValue={setTranspFile}
        />
        <InputManual
          defaultFileName="idOrganism"
          value={idFile}
          setValue={setIdFile}
          disable
        />

        <ChooseFile
          defaultFileName="directory"
          disabled
          handleOpen={() => handleOpenDirectory("directory")}
          fileName={files.directory.directory}
          disabledButton
        />
        <section className="flex w-[72.5%] flex-col gap-4 py-6">
          <Title titleValue="advancedParameters" />
          <div className="mt-4 grid grid-cols-2 gap-5">
            <InputAdvanced
              value={values.minimumReadLength}
              setValue={onChange}
              name="minimumReadLength"
              label={t("advancedParams.minReadLength")}
            />
            <InputAdvanced
              value={values.maximumReadLength}
              setValue={onChange}
              name="maximumReadLength"
              label={t("advancedParams.maxReadLength")}
            />
            <InputAdvanced
              value={values.trimmingQuality}
              setValue={onChange}
              name="trimmingQuality"
              label={t("advancedParams.trimQuality")}
            />
            <InputAdvanced
              value={values.minimumMapingQuality}
              setValue={onChange}
              name="minimumMapingQuality"
              label={t("advancedParams.minMappingQuality")}
            />
            <InputAdvanced
              value={values.numberOfThreadsForAnalysis}
              setValue={onChange}
              name="numberOfThreadsForAnalysis"
              label={t("advancedParams.numThreads")}
              className="col-span-2"
            />
          </div>
          <h2 className="font-poppins text-textPrimary text-md font-bold">
            {t("stringDbOptions.title")}
          </h2>
          <div className="flex items-center gap-1">
            <Checkbox className="h-4 w-4 border-[1px] border-gray-300" />
            <Label className="text-sm font-normal text-[var(--text-primaryGray)]">
              {t("stringDbOptions.generateInteractionNetwork")}
            </Label>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <InputAdvanced
              value={values.minConfidenceThreshold}
              setValue={onChange}
              name="minConfidenceThreshold"
              label={t("stringDbOptions.minConfidenceThreshold")}
            />
            <InputAdvanced
              label={t("stringDbOptions.maxNonEssentialGenes")}
              value={values.maxNonEssentialGenes}
              setValue={onChange}
              name="maxNonEssentialGenes"
            />
          </div>
          <div>
            <Label className="font-poppins text-xs font-bold text-[var(--text-primaryGray)]">
              {t("analysis.progress")}
            </Label>
            <ProgressMock progress={progress} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button
              className="font-inter h-[30px] cursor-pointer bg-[#0D80F2] text-xs text-white hover:bg-[#63a5e7]"
              onClick={handleStartAnalysis}
              disabled={isRunning}
            >
              {t("button.startAnalysis")}
            </Button>
            <Button
              disabled={!isRunning}
              onClick={cancelAnalysis}
              variant="default"
              className="font-inter text-textPrimary h-[30px] cursor-pointer bg-gray-300 text-xs hover:bg-gray-200"
            >
              {t("button.cancelAnalysis")}
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}

export default ProcessSampleScreen;
