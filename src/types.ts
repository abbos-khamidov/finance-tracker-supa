export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  user_id: string;
  date: string;
  amount: number;
  type: TransactionType;
  category: string;
  note?: string | null;
  created_at?: string;
}

export type SortOption = "date_desc" | "date_asc" | "amount_desc" | "amount_asc";
