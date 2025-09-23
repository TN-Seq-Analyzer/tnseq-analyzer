import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

function SearchBar({
  setSearchTerm,
}: {
  setSearchTerm: (term: string) => void;
}) {
  return (
    <div className="mb-5 w-full">
      <Input
        placeholder="Pesquise pelo nome do projeto ou data"
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
