import { FC, useMemo } from "react";
import { Transaction } from "../types";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  XAxis,
  YAxis,
  Bar,
} from "recharts";

interface ChartsViewProps {
  transactions: Transaction[];
}

const COLORS = [
  "#38bdf8",
  "#22c55e",
  "#a855f7",
  "#f97316",
  "#e11d48",
  "#14b8a6",
  "#f59e0b",
];

export const ChartsView: FC<ChartsViewProps> = ({ transactions }) => {
  const expenses = useMemo(
    () => transactions.filter((t) => t.type === "expense"),
    [transactions]
  );

  const byCategoryData = useMemo(() => {
    const map = new Map<string, number>();
    expenses.forEach((t) => {
      map.set(t.category, (map.get(t.category) || 0) + t.amount);
    });
    return Array.from(map.entries()).map(([name, value]) => ({
      name,
      value,
    }));
  }, [expenses]);

  const byMonthData = useMemo(() => {
    const map = new Map<string, number>();
    expenses.forEach((t) => {
      const d = new Date(t.date);
      const key = `${d.getFullYear()}-${(d.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`;
      map.set(key, (map.get(key) || 0) + t.amount);
    });
    return Array.from(map.entries())
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .map(([month, amount]) => ({
        month,
        amount,
      }));
  }, [expenses]);

  return (
    <div className="charts-container">
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Графики</div>
            <div className="card-subtitle">Визуальное распределение</div>
          </div>
        </div>
        <div className="charts-container">
          <div className="chart-block">
            <div className="chart-title">Расходы по категориям</div>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={byCategoryData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="55%"
                  outerRadius="75%"
                  paddingAngle={3}
                >
                  {byCategoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${entry.name}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) =>
                    value.toLocaleString("ru-RU")
                  }
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-block">
            <div className="chart-title">Расходы по месяцам</div>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byMonthData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) =>
                    value.toLocaleString("ru-RU")
                  }
                />
                <Bar dataKey="amount">
                  {byMonthData.map((entry, index) => (
                    <Cell
                      key={`bar-${entry.month}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
