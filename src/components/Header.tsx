import { FC } from "react";

interface HeaderProps {
  income: number;
  expense: number;
  balance: number;
  email?: string;
  onLogout: () => void;
}

function formatCurrency(value: number) {
  return value.toLocaleString("ru-RU", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export const Header: FC<HeaderProps> = ({
  income,
  expense,
  balance,
  email,
  onLogout,
}) => {
  const now = new Date();
  const dateLabel = now.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "short",
  });

  return (
    <header className="header card">
      <div className="header-top">
        <div>
          <div className="app-name">finance tracker</div>
          <div className="date-label">Сегодня: {dateLabel}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="card-subtitle">
            {email ?? "Аккаунт"} · Online · Supabase
          </div>
          <button
            style={{
              border: "none",
              background: "transparent",
              color: "#9ca3af",
              fontSize: 11,
              cursor: "pointer",
              marginTop: 2,
            }}
            type="button"
            onClick={onLogout}
          >
            Выйти
          </button>
        </div>
      </div>
      <div className="balance-block">
        <div className="balance-label">Текущий баланс</div>
        <div className="balance-value">
          {formatCurrency(balance)} <span style={{ fontSize: 13 }}>сум</span>
        </div>
        <div className="balance-row">
          <div className="balance-chip">
            <span className="balance-dot income" />
            Доход: {formatCurrency(income)}
          </div>
          <div className="balance-chip">
            <span className="balance-dot expense" />
            Расход: {formatCurrency(expense)}
          </div>
        </div>
      </div>
    </header>
  );
};
