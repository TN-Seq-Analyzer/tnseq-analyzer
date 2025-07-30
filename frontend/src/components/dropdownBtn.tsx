import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { changeLanguage } from "@/i18n";
import { Check, Globe } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

function DropdownBtn() {
  const handleLanguageChange = (lang: string) => {
    changeLanguage(lang);
    setPosition(lang === "en" ? "english" : "portuguese");
  };
  const { t } = useTranslation("translation", { keyPrefix: "language" });

  const [position, setPosition] = useState("english");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none focus-visible:outline-none">
        <Globe
          color="var(--text-primaryGray)"
          className="cursor-pointer"
          size={14}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className="text-sm">{t("title")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => handleLanguageChange("en")}
          className={`flex justify-between items-center ${
            position === "english" ? "bg-gray-200" : ""
          }`}
        >
          {t("english")}
          {position === "english" && <Check size={16} />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => handleLanguageChange("pt")}
          className={`flex justify-between items-center ${
            position === "portuguese" ? "bg-gray-200" : ""
          }`}
        >
          {t("portuguese")}
          {position === "portuguese" && <Check size={16} />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default DropdownBtn;
