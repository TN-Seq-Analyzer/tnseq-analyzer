import { useTranslation } from "react-i18next";
import Description from "../Description";
import Title from "../Title";
import BtnLoaderProject from "./BtnLoaderProject";
import BtnModal from "./BtnModal";
import CardSection from "./CardSection";

function SectionContent() {
  const { t } = useTranslation("translation", {
    keyPrefix: "content.home",
  });

  return (
    <div className="flex flex-col gap-3">
      <Title titleValue="home" />
      <Description descriptionValue="home" />
      <p className="font-inter text-xs font-bold">{t("subtitle")}</p>
      <CardSection />
      <div className="mt-4 flex w-full items-center gap-2">
        <BtnModal />
        <BtnLoaderProject />
      </div>
    </div>
  );
}

export default SectionContent;
