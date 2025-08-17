import { BarChart3, FileText, FlaskConical, History, Home } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import { SidebarItem } from "./SidebarItem";

const Sidebar: React.FC = () => {
  const { t } = useTranslation("translation", {
    keyPrefix: "sideBar",
  });
  const location = useLocation();
  return (
    <aside className="flex w-25/100 border-r-[1px] border-[var(--color-divider)] p-4 lg:w-2/10 lg:px-10 lg:py-7">
      <div className="flex h-full w-full flex-col">
        <div className="flex flex-col space-y-1">
          <SidebarItem
            icon={<Home size={20} />}
            text={t("home")}
            to="/"
            active={location.pathname === "/"}
          />
          <SidebarItem
            icon={<FlaskConical size={20} />}
            text={t("processSample")}
            to="/processSample"
            active={location.pathname === "/processSample"}
          />
          <SidebarItem
            icon={<BarChart3 size={20} />}
            text={t("interactiveAnalysis")}
            to="/interactiveAnalysis"
            active={location.pathname === "/interactiveAnalysis"}
          />
          <SidebarItem
            icon={<History size={20} />}
            text={t("analysisHistory")}
            to="/analysisHistory"
            active={location.pathname === "/analysisHistory"}
          />
          <SidebarItem
            icon={<FileText size={20} />}
            text={t("pipelineLog")}
            to="/pipelineLog"
            active={location.pathname === "/pipelineLog"}
          />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
