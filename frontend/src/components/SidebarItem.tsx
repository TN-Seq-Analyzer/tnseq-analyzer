import { SidebarItemProps } from "@/types/SidebarItem.type";
import { Link } from "react-router";

export const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  text,
  to,
  active,
}) => {
  return (
    <Link
      to={to}
      className={`flex items-center rounded-lg px-3 py-2.5 transition-colors hover:bg-gray-50 ${
        active ? "bg-[#f2f2f2] font-bold" : "font-medium"
      }`}
    >
      <div className="mr-1 flex w-4 items-center justify-center text-[var(--text-primaryGray)]">
        {icon}
      </div>
      <div className="text-[11px] text-[var(--text-primaryGray)]">{text}</div>
    </Link>
  );
};
