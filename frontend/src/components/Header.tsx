import { useTranslation } from "react-i18next";
import DropdownBtn from "./dropdownBtn";
import Logo from "./logo";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Download } from "lucide-react";

function Header() {
  const { t } = useTranslation("translation", { keyPrefix: "header.link" });
  const handleExport = async () => {
    try {
      const ok = await window.electronFile.exportProject();
      if (ok) {
        toast.success(t("exportProject.success"));
      } else {
        toast.error(t("exportProject.error"));
      }
    } catch (e) {
      toast.error(t("exportProject.error"));
    }
  };

  return (
    <div className="flex h-12 w-full items-center justify-between border-b-[1px] border-[var(--color-divider)] px-4 select-none lg:h-16 lg:px-10">
      <Logo />
      <div className="flex items-center gap-3 lg:gap-4">
        <Button
          onClick={handleExport}
          variant="outline"
          size="sm"
          className="group font-poppins relative flex cursor-pointer items-center gap-1.5 overflow-hidden border-[var(--color-divider)]/70 text-[10px] font-semibold tracking-wide uppercase hover:border-[var(--color-divider)] hover:bg-[var(--color-divider)]/10"
          aria-label={t("exportProject.button") as string}
        >
          <Download
            size={14}
            className="text-[var(--text-primaryGray)] transition-transform group-hover:scale-110"
          />
          <span className="relative top-[2px] z-10 text-[var(--text-primaryGray)] group-hover:text-[var(--text-primaryGray)]">
            {t("exportProject.button")}
          </span>
        </Button>
        <DropdownBtn />
        <p className="font-poppins cursor-pointer text-xs font-semibold text-[var(--text-primaryGray)]">
          {t("help")}
        </p>
        <p className="font-poppins cursor-pointer text-xs font-semibold text-[var(--text-primaryGray)]">
          {t("about")}
        </p>
      </div>
    </div>
  );
}

export default Header;
