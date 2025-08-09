import { useTranslation } from "react-i18next";

function Title({ titleValue }: { titleValue: string }) {
  const { t } = useTranslation("translation", {
    keyPrefix: "content.title",
  });

  return <h1 className="font-inter text-xl font-bold">{t(titleValue)}</h1>;
}

export default Title;
