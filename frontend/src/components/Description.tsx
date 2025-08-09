import { useTranslation } from "react-i18next";

function Description({ descriptionValue }: { descriptionValue: string }) {
  const { t } = useTranslation("translation", {
    keyPrefix: "content.description",
  });
  return (
    <p className="font-inter mb-2 text-xs font-light">{t(descriptionValue)}</p>
  );
}

export default Description;
