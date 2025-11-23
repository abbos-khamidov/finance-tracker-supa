import { FC, useMemo } from "react";

interface AnalyticsViewProps {
  income: number;
  expense: number;
  balance: number;
  byCategory: Record<string, number>;
}

function formatCurrency(value: number) {
  return value.toLocaleString("ru-RU", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export const AnalyticsView: FC<AnalyticsViewProps> = ({
  income,
  expense,
  balance,
  byCategory,
}) => {
  const topCategories = useMemo(() => {
    return Object.entries(byCategory)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);
  }, [byCategory]);

  return (
    <>
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Итоги</div>
            <div className="card-subtitle">Суммарные значения</div>
          </div>
        </div>
        <div className="analytics-grid">
          <div className="analytics-card">
            <div className="analytics-label">Доход</div>
            <div className="analytics-value text-income">
              + {formatCurrency(income)}
            </div>
          </div>
          <div className="analytics-card">
            <div className="analytics-label">Расход</div>
            <div className="analytics-value">
              - {formatCurrency(expense)}
            </div>
          </div>
          <div className="analytics-card">
            <div className="analytics-label">Баланс</div>
            <div className="analytics-value">
              {formatCurrency(balance)}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Топ категорий расходов</div>
            <div className="card-subtitle">
              Куда уходит больше всего денег
            </div>
          </div>
        </div>
        <div className="category-list">
          {topCategories.length === 0 && (
            <div className="card-subtitle">
              Добавь расходы, чтобы увидеть статистику.
            </div>
          )}
          {topCategories.map(([category, amount]) => (
            <div key={category} className="category-row">
              <div className="category-label">{category}</div>
              <div className="category-value">
                - {formatCurrency(amount)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
