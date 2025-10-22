import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

function SearchBar({
  setSearchTerm,
}: {
  setSearchTerm: (term: string) => void;
}) {
  const { t } = useTranslation("translation", {
    keyPrefix: "content.analysisHistory",
  });

  return (
    <div className="mb-5 w-full">
      <Input
        placeholder={t("search.placeholder")}
        prefix={<SearchOutlined />}
        onChange={(e) => {
          (setSearchTerm(e.target.value), console.log(e.target.value));
        }}
        className="w-full rounded-md bg-red-900 px-3 py-2"
      />
    </div>
  );
}

export default SearchBar;
