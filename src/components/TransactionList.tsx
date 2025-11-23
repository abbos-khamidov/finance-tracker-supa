import { FC } from "react";
import { Transaction } from "../types";
import { TransactionItem } from "./TransactionItem";

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export const TransactionList: FC<TransactionListProps> = ({
  transactions,
  onDelete,
}) => {
  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">История</div>
          <div className="card-subtitle">
            {transactions.length
              ? `${transactions.length} операций`
              : "Пока нет операций"}
          </div>
        </div>
      </div>
      {transactions.length > 0 && (
        <div className="list">
          {transactions.map((tx) => (
            <TransactionItem key={tx.id} tx={tx} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
};
