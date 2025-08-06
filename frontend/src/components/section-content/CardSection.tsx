import { Bug, ChartScatter, FlaskConical, History } from "lucide-react";
import { useTranslation } from "react-i18next";
import CardInfo from "./CardInfo";

function CardSection() {
  const { t } = useTranslation("translation", {
    keyPrefix: "content.home",
  });
  return (
    <section className="auto-rows grid grid-cols-3 gap-4">
      <CardInfo
        Icon={<FlaskConical size={14} color="#121417" />}
        title={t("card1.title")}
        description={t("card1.description")}
      />
      <CardInfo
        Icon={<ChartScatter size={14} color="#121417" />}
        title={t("card2.title")}
        description={t("card2.description")}
      />
      <CardInfo
        Icon={<History size={14} color="#121417" />}
        title={t("card3.title")}
        description={t("card3.description")}
      />
      <CardInfo
        Icon={<Bug size={14} color="#121417" />}
        title={t("card4.title")}
        description={t("card4.description")}
      />
    </section>
  );
}

export default CardSection;
