import { FC } from "react";

export type TabKey = "transactions" | "analytics" | "charts";

interface TabBarProps {
  active: TabKey;
  onChange: (tab: TabKey) => void;
}

export const TabBar: FC<TabBarProps> = ({ active, onChange }) => {
  return (
    <div className="tab-bar">
      <button
        className={`tab-button ${active === "transactions" ? "active" : ""}`}
        onClick={() => onChange("transactions")}
      >
        <span>⋯</span>
        <span>Транзакции</span>
      </button>
      <button
        className={`tab-button ${active === "analytics" ? "active" : ""}`}
        onClick={() => onChange("analytics")}
      >
        <span>◎</span>
        <span>Аналитика</span>
      </button>
      <button
        className={`tab-button ${active === "charts" ? "active" : ""}`}
        onClick={() => onChange("charts")}
      >
        <span>◔</span>
        <span>Графики</span>
      </button>
    </div>
  );
};
