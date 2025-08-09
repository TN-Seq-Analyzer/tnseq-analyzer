import { useTranslation } from "react-i18next";
import DropdownBtn from "./dropdownBtn";
import Logo from "./logo";

function Header() {
  const { t } = useTranslation("translation", { keyPrefix: "header.link" });
  return (
    <div className="flex h-12 w-full items-center justify-between border-b-[1px] border-[var(--color-divider)] px-4 select-none lg:h-16 lg:px-10">
      <Logo />
      <div className="flex items-center gap-4 lg:gap-4">
        {/* as tags "p" vao virar rotas posteriormente */}
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
