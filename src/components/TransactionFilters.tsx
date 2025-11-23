import { FC } from "react";
import { FiltersState } from "../hooks/useTransactions";

interface TransactionFiltersProps {
  filters: FiltersState;
  onChange: (next: Partial<FiltersState>) => void;
  categories: string[];
}

export const TransactionFilters: FC<TransactionFiltersProps> = ({
  filters,
  onChange,
  categories,
}) => {
  return (
    <div className="filters">
      <div className="filters-row">
        <select
          className="select"
          value={filters.type}
          onChange={(e) =>
            onChange({ type: e.target.value as FiltersState["type"] })
          }
        >
          <option value="all">Все типы</option>
          <option value="expense">Расходы</option>
          <option value="income">Доходы</option>
        </select>

        <select
          className="select"
          value={filters.category}
          onChange={(e) =>
            onChange({
              category: e.target.value as FiltersState["category"],
            })
          }
        >
          <option value="all">Все категории</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="filters-row">
        <select
          className="select"
          value={filters.sortBy}
          onChange={(e) =>
            onChange({
              sortBy: e.target.value as FiltersState["sortBy"],
            })
          }
        >
          <option value="date_desc">Дата ↓ (новые)</option>
          <option value="date_asc">Дата ↑ (старые)</option>
          <option value="amount_desc">Сумма ↓</option>
          <option value="amount_asc">Сумма ↑</option>
        </select>
      </div>
    </div>
  );
};
