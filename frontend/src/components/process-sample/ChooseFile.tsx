import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface ChooseFileProps {
  fileName?: string;
  defaultFileName?: string;
}

function ChooseFile({ fileName, defaultFileName }: ChooseFileProps) {
  const fileNameToDisplay = fileName ? fileName : defaultFileName;
  const { t } = useTranslation("translation", {
    keyPrefix: "content.processSample",
  });
  return (
    <div className="flex flex-col gap-1">
      <Label className="font-poppins text-[10px] font-bold text-[var(--text-primaryGray)]">
        {t(`label.${defaultFileName}`)}
      </Label>
      <div className="flex flex-1 gap-1">
        <Input
          disabled
          className="font-inter bg-bgInputFile text-textPrimary h-[30px] w-[60%] cursor-pointer rounded-sm border-0 text-[10px] font-bold select-none md:text-[10px]"
          value={t(`file.${fileNameToDisplay}`)}
        />
        <Button className="font-inter h-[30px] cursor-pointer rounded-sm text-xs font-normal select-none">
          {t("button.upload")}
        </Button>
      </div>
    </div>
  );
}

export default ChooseFile;
