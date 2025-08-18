import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface ChooseFileProps {
  fileName?: string;
  defaultFileName?: string;
  disabled?: boolean;
  disabledButton?: boolean;
  handleOpen?: () => Promise<void>;
}

function ChooseFile({
  fileName,
  defaultFileName,
  disabled,
  disabledButton = false,
  handleOpen,
}: ChooseFileProps) {
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
          disabled={disabled}
          className={`font-inter bg-bgInputFile ${!fileName ? "text-textPrimary" : "text-green-500"} h-[30px] w-[60%] rounded-sm border-0 text-[10px] font-bold select-none md:text-[10px]`}
          value={!fileName ? t(`file.${fileNameToDisplay}`) : fileName}
        />
        <Button
          disabled={disabledButton}
          onClick={handleOpen}
          className="font-inter h-[30px] cursor-pointer rounded-sm text-xs font-normal select-none"
        >
          {t("button.upload")}
        </Button>
      </div>
    </div>
  );
}

export default ChooseFile;
