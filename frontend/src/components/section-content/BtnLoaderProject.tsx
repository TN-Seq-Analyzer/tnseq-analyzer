import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Upload } from "lucide-react";

function BtnLoaderProject() {
  const { t } = useTranslation("translation", {
    keyPrefix: "content.home.modal",
  });

  const handleImport = async () => {
    try {
      const result = await window.electronFile.importProject();
      if (!result || !result.success) {
        if (result?.error === "CANCELED") return;
        if (result?.error === "INVALID_JSON") {
          toast.error(
            t("importProject.invalid", {
              ns: "translation",
              keyPrefix: "header.link",
            }),
          );
          return;
        }
        if (result?.error?.startsWith("MISSING_FIELD_")) {
          toast.error(
            t("importProject.invalid", {
              ns: "translation",
              keyPrefix: "header.link",
            }),
          );
          return;
        }
        toast.error(
          t("importProject.error", {
            ns: "translation",
            keyPrefix: "header.link",
          }),
        );
        return;
      }
      toast.success(
        t("importProject.success", {
          ns: "translation",
          keyPrefix: "header.link",
        }),
      );
    } catch (e) {
      toast.error(
        t("importProject.error", {
          ns: "translation",
          keyPrefix: "header.link",
        }),
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
      {t("loaderProject")}
    </Button>
  );
}

export default BtnLoaderProject;
