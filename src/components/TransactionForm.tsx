import { FC, FormEvent, useState } from "react";
import { TransactionType } from "../types";

interface TransactionFormProps {
  onAdd: (data: {
    date: string;
    amount: number;
    type: TransactionType;
    category: string;
    note?: string;
  }) => void;
  existingCategories: string[];
}

const defaultCategories = [
  "Еда",
  "Транспорт",
  "Дом",
  "Подписки",
  "Развлечения",
  "Здоровье",
  "Одежда",
];

export const TransactionForm: FC<TransactionFormProps> = ({
  onAdd,
  existingCategories,
}) => {
  const today = new Date().toISOString().slice(0, 10);
  const [type, setType] = useState<TransactionType>("expense");
  const [date, setDate] = useState(today);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");

  const mergedCategories = Array.from(
    new Set([...defaultCategories, ...existingCategories])
  );

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const numericAmount = Number(amount.replace(",", "."));
    if (!numericAmount || numericAmount <= 0 || !category) return;

    onAdd({
      date,
      amount: numericAmount,
      type,
      category,
      note: note.trim() || undefined,
    });

    setAmount("");
    setNote("");
  }

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <div className="card-header">
        <div>
          <div className="card-title">Добавить</div>
          <div className="card-subtitle">Быстрый ввод операции</div>
        </div>
        <div className="badge">Online · Supabase</div>
      </div>

      <div className="form-row">
        <div>
          <div className="label">Тип</div>
          <div className="chip-toggle-group">
            <button
              type="button"
              className={
                "chip-toggle" +
                (type === "expense" ? " active-expense" : "")
              }
              onClick={() => setType("expense")}
            >
              Расход
            </button>
            <button
              type="button"
              className={
                "chip-toggle" + (type === "income" ? " active-income" : "")
              }
              onClick={() => setType("income")}
            >
              Доход
            </button>
          </div>
        </div>
        <div>
          <div className="label">Дата</div>
          <input
            type="date"
            className="input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      <div className="form-row">
        <div>
          <div className="label">Сумма</div>
          <input
            className="input"
            inputMode="decimal"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div>
          <div className="label">Категория</div>
          <input
            className="input"
            list="category-list"
            placeholder="Например, Еда"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <datalist id="category-list">
            {mergedCategories.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>
      </div>

      <div>
        <div className="label">Комментарий (опционально)</div>
        <input
          className="input"
          placeholder="Кофе, такси, аренда и т.п."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      <button className="button-primary" type="submit">
        Сохранить операцию
      </button>
    </form>
  );
};
