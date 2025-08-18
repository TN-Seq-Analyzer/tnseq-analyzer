import { useTranslation } from "react-i18next";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

function InputManual({
  fileName,
  defaultFileName,
  value,
  setValue,
  disable,
}: {
  fileName?: string;
  defaultFileName?: string;
  value: string;
  setValue: (value: string) => void;
  disable?: boolean;
}) {
  const fileNameToDisplay = fileName ? fileName : defaultFileName;
  const { t } = useTranslation("translation", {
    keyPrefix: "content.processSample",
  });

  return (
    <div className="flex flex-col gap-1">
      <Label className="font-poppins text-[10px] font-bold text-[var(--text-primaryGray)]">
        {t(`label.${fileNameToDisplay}`)}
      </Label>
      <Input
        className={`font-inter bg-bgInputFile h-[30px] w-[60%] rounded-sm border-0 text-[10px] font-bold text-[var(--text-primaryGray)] select-none md:text-[10px]`}
        placeholder={t(`file.${fileNameToDisplay}`)}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        disabled={disable}
      />
    </div>
  );
}

export default InputManual;
