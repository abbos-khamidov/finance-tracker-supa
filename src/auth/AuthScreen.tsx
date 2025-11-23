import { FormEvent, useState } from "react";
import { supabase } from "../supabase/client";

type Mode = "signin" | "signup";

export const AuthScreen = () => {
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) setErrorMsg(error.message);
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) setErrorMsg(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-shell">
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Finance Tracker</div>
            <div className="card-subtitle">
              Войдите или зарегистрируйтесь, чтобы видеть свои данные на всех устройствах
            </div>
          </div>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div>
              <div className="label">Режим</div>
              <div className="chip-toggle-group">
                <button
                  type="button"
                  className={
                    "chip-toggle" + (mode === "signin" ? " active-income" : "")
                  }
                  onClick={() => setMode("signin")}
                >
                  Вход
                </button>
                <button
                  type="button"
                  className={
                    "chip-toggle" + (mode === "signup" ? " active-expense" : "")
                  }
                  onClick={() => setMode("signup")}
                >
                  Регистрация
                </button>
              </div>
            </div>
          </div>

          <div>
            <div className="label">Email</div>
            <input
              className="input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <div className="label">Пароль</div>
            <input
              className="input"
              type="password"
              minLength={6}
              placeholder="Минимум 6 символов"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {errorMsg && (
            <div
              style={{
                fontSize: 12,
                color: "#fca5a5",
              }}
            >
              {errorMsg}
            </div>
          )}

          <button className="button-primary" type="submit" disabled={loading}>
            {loading
              ? "Загрузка..."
              : mode === "signin"
              ? "Войти"
              : "Зарегистрироваться"}
          </button>
        </form>
      </div>
    </div>
  );
};
