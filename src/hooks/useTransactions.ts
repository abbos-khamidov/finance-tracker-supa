import { useEffect, useMemo, useState } from "react";
import { SortOption, Transaction, TransactionType } from "../types";
import { supabase } from "../supabase/client";

export interface FiltersState {
  type: TransactionType | "all";
  category: string | "all";
  sortBy: SortOption;
}

const defaultFilters: FiltersState = {
  type: "all",
  category: "all",
  sortBy: "date_desc",
};

export function useTransactions(userId: string | null) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filters, setFilters] = useState<FiltersState>(defaultFilters);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) {
      setTransactions([]);
      return;
    }

    async function load() {
      setLoading(true);
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", userId)
        .order("date", { ascending: false })
        .order("created_at", { ascending: false });

      if (!error && data) {
        setTransactions(
          data.map((t) => ({
            ...t,
            amount: Number(t.amount),
          }))
        );
      }
      setLoading(false);
    }

    load();
  }, [userId]);

  function updateFilters(next: Partial<FiltersState>) {
    setFilters((prev) => ({ ...prev, ...next }));
  }

  async function addTransaction(data: {
    date: string;
    amount: number;
    type: TransactionType;
    category: string;
    note?: string;
  }) {
    if (!userId) return;

    const payload = {
      user_id: userId,
      date: data.date,
      amount: data.amount,
      type: data.type,
      category: data.category,
      note: data.note ?? null,
    };

    const { data: inserted, error } = await supabase
      .from("transactions")
      .insert(payload)
      .select("*")
      .single();

    if (!error && inserted) {
      setTransactions((prev) => [
        {
          ...inserted,
          amount: Number(inserted.amount),
        },
        ...prev,
      ]);
    }
  }

  async function deleteTransaction(id: string) {
    if (!userId) return;

    const { error } = await supabase
      .from("transactions")
      .delete()
      .match({ id, user_id: userId });

    if (!error) {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    }
  }

  const filteredSorted = useMemo(() => {
    let result = [...transactions];

    if (filters.type !== "all") {
      result = result.filter((t) => t.type === filters.type);
    }

    if (filters.category !== "all") {
      result = result.filter((t) => t.category === filters.category);
    }

    result.sort((a, b) => {
      const da = new Date(a.date).getTime();
      const db = new Date(b.date).getTime();

      switch (filters.sortBy) {
        case "date_desc":
          return db - da;
        case "date_asc":
          return da - db;
        case "amount_desc":
          return b.amount - a.amount;
        case "amount_asc":
          return a.amount - b.amount;
        default:
          return 0;
      }
    });

    return result;
  }, [transactions, filters]);

  const stats = useMemo(() => {
    let income = 0;
    let expense = 0;

    transactions.forEach((t) => {
      if (t.type === "income") income += t.amount;
      else expense += t.amount;
    });

    const byCategory: Record<string, number> = {};
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        byCategory[t.category] = (byCategory[t.category] || 0) + t.amount;
      });

    return {
      income,
      expense,
      balance: income - expense,
      byCategory,
    };
  }, [transactions]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    transactions.forEach((t) => set.add(t.category));
    return Array.from(set);
  }, [transactions]);

  return {
    loading,
    transactions,
    filteredSorted,
    filters,
    updateFilters,
    addTransaction,
    deleteTransaction,
    stats,
    categories,
  };
}
