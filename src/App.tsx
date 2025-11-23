import "./styles.css";
import { useEffect, useState } from "react";
import { supabase } from "./supabase/client";
import { AuthScreen } from "./auth/AuthScreen";
import { useTransactions } from "./hooks/useTransactions";
import { Header } from "./components/Header";
import { TabBar, TabKey } from "./components/TabBar";
import { TransactionForm } from "./components/TransactionForm";
import { TransactionFilters } from "./components/TransactionFilters";
import { TransactionList } from "./components/TransactionList";
import { AnalyticsView } from "./components/AnalyticsView";
import { ChartsView } from "./components/ChartsView";

function AppInner() {
  const [tab, setTab] = useState<TabKey>("transactions");
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | undefined>();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    async function load() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        setUserId(session.user.id);
        setUserEmail(session.user.email ?? undefined);
      } else {
        setUserId(null);
        setUserEmail(undefined);
      }
      setAuthChecked(true);
    }

    load();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUserId(session.user.id);
        setUserEmail(session.user.email ?? undefined);
      } else {
        setUserId(null);
        setUserEmail(undefined);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const {
    loading,
    transactions,
    filteredSorted,
    filters,
    updateFilters,
    addTransaction,
    deleteTransaction,
    stats,
    categories,
  } = useTransactions(userId);

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  if (!authChecked) {
    return (
      <div className="app-shell">
        <div className="card">
          <div className="card-title">Загрузка...</div>
        </div>
      </div>
    );
  }

  if (!userId) {
    return <AuthScreen />;
  }

  return (
    <div className="app-shell">
      <Header
        income={stats.income}
        expense={stats.expense}
        balance={stats.balance}
        email={userEmail}
        onLogout={handleLogout}
      />

      <TabBar active={tab} onChange={setTab} />

      {tab === "transactions" && (
        <>
          <TransactionForm
            onAdd={addTransaction}
            existingCategories={categories}
          />

          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Фильтры</div>
                <div className="card-subtitle">
                  Нажми, чтобы посмотреть другой срез
                </div>
              </div>
            </div>
            <TransactionFilters
              filters={filters}
              onChange={updateFilters}
              categories={categories}
            />
          </div>

          <TransactionList
            transactions={filteredSorted}
            onDelete={deleteTransaction}
          />

          {loading && (
            <div className="card-subtitle" style={{ marginTop: 4 }}>
              Обновление данных...
            </div>
          )}
        </>
      )}

      {tab === "analytics" && (
        <AnalyticsView
          income={stats.income}
          expense={stats.expense}
          balance={stats.balance}
          byCategory={stats.byCategory}
        />
      )}

      {tab === "charts" && <ChartsView transactions={transactions} />}
    </div>
  );
}

export default AppInner;
