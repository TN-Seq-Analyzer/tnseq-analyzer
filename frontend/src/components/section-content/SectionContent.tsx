import { useTranslation } from "react-i18next";
import BtnLoaderProject from "./BtnLoaderProject";
import BtnModal from "./BtnModal";
import CardSection from "./CardSection";

function SectionContent() {
  const { t } = useTranslation("translation", {
    keyPrefix: "content.home",
  });

  return (
    <div className="flex w-full flex-1 select-none">
      <aside className="flex w-25/100 border-r-[1px] border-[var(--color-divider)] p-4 lg:w-2/10 lg:px-10 lg:py-7"></aside>
      <main className="flex flex-1 bg-[var(--bg-main)] px-8 py-8 lg:py-12 lg:pl-10">
        <div className="flex flex-col gap-3">
          <h1 className="font-inter text-xl font-bold">{t("title")}</h1>
          <p className="font-inter mb-2 text-xs font-light">
            {t("description")}
          </p>
          <p className="font-inter text-xs font-bold">{t("subtitle")}</p>
          <CardSection />
          <div className="mt-4 flex w-full items-center gap-2">
            <BtnModal />
            <BtnLoaderProject />
          </div>
        </div>
      </main>
    </div>
  );
}

export default SectionContent;
