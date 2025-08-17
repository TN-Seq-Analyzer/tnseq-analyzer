import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";

function BtnLoaderProject() {
  const { t } = useTranslation("translation", {
    keyPrefix: "content.home.modal",
  });
  return (
    <Button
      disabled
      variant="secondary"
      className="text-textPrimary font-inter h-[30px] cursor-pointer rounded-full bg-[#F2F2F5] px-4 text-[10px] font-bold select-none"
    >
      {t("loaderProject")}
    </Button>
  );
}

export default BtnLoaderProject;
