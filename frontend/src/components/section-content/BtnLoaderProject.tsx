import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Upload } from "lucide-react";

function BtnLoaderProject() {
  const { t } = useTranslation("translation");

  const handleImport = async () => {
    try {
      const result = await window.electronFile.importProject();
      if (!result || !result.success) {
        if (result?.error === "CANCELED") return;
        if (result?.error === "INVALID_JSON") {
          toast.error(
            t("header.link.importProject.invalid"),
          );
          return;
        }
        if (result?.error?.startsWith("MISSING_FIELD_")) {
          toast.error(
            t("header.link.importProject.invalid"),
          );
          return;
        }
        toast.error(
          t("header.link.importProject.error"),
        );
        return;
      }
      toast.success(
        t("header.link.importProject.success"),
      );
    } catch (e) {
      toast.error(
        t("header.link.importProject.error"),
      );
    }
  };

  return (
    <Button
      onClick={handleImport}
      variant="secondary"
      className="text-textPrimary font-inter flex h-[30px] cursor-pointer items-center gap-1 rounded-full bg-[#F2F2F5] px-4 text-[10px] font-bold select-none"
    >
      <Upload size={12} />
  {t("header.link.importProject.button")}
    </Button>
  );
}

export default BtnLoaderProject;
