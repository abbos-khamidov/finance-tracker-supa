import { FC } from "react";
import { Transaction } from "../types";

interface TransactionItemProps {
  tx: Transaction;
  onDelete: (id: string) => void;
}

function formatAmount(tx: Transaction) {
  const sign = tx.type === "expense" ? "-" : "+";
  return `${sign} ${tx.amount.toLocaleString("ru-RU")}`;
}

export const TransactionItem: FC<TransactionItemProps> = ({ tx, onDelete }) => {
  const dateLabel = new Date(tx.date).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "short",
  });

  return (
    <div className="list-item">
      <div className="list-item-main">
        <div className="list-item-title">
          {tx.category}
          {tx.note ? ` · ${tx.note}` : ""}
        </div>
        <div className="list-item-meta">
          {dateLabel} · {tx.type === "expense" ? "Расход" : "Доход"}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div
          className={`list-item-amount ${
            tx.type === "expense" ? "expense" : "income"
          }`}
        >
          {formatAmount(tx)}
        </div>
        <button
          className="delete-button"
          type="button"
          onClick={() => onDelete(tx.id)}
        >
          ×
        </button>
      </div>
    </div>
  );
};
