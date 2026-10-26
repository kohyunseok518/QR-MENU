import { useEffect, useMemo, useState, type FormEvent } from "react";
import type { Session, SupabaseClient } from "@supabase/supabase-js";
import { Eye, EyeOff, ArrowRight, ExternalLink } from "lucide-react";
import { BrandWordmark } from "../components/BrandWordmark";
import { getAdminClient } from "./client";
import { createAdminRepository } from "./repository";
import { AdminWorkspace } from "./AdminWorkspace";
import "../styles.css";
import "./admin.css";

function Login({ client }: { client: SupabaseClient }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function login(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const { data, error } = await client.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) {
        setError(
          error.code === "invalid_credentials"
            ? "이메일 또는 비밀번호를 확인해 주세요."
            : error.code === "email_not_confirmed"
              ? "이메일 확인을 완료한 뒤 로그인해 주세요."
              : "로그인하지 못했어요. 계정과 연결 상태를 확인해 주세요.",
        );
      } else if (!data.session || data.user?.is_anonymous)
        setError("등록된 관리자 계정으로 로그인해 주세요.");
    } catch {
      setError("연결 상태를 확인한 후 다시 시도해 주세요.");
    } finally {
      setBusy(false);
      setPassword("");
    }
  }
  return (
    <main className="admin-login">
      <section className="admin-login-intro">
        <a href="/menu?lang=ko" aria-label="바글바글 메뉴판">
          <BrandWordmark />
        </a>
        <p className="admin-kicker">메뉴판 관리</p>
        <h1>
          가게 메뉴를
          <br />
          한곳에서 편하게.
        </h1>
        <p>
          메뉴와 가격, 사진을 수정하고
          <br />
          오늘의 품절 상태를 관리하세요.
        </p>
        <a className="admin-text-link" href="/menu?lang=ko">
          손님 메뉴판 보기 <ExternalLink size={15} />
        </a>
      </section>
      <section className="admin-login-card" aria-labelledby="login-heading">
        <p className="admin-kicker">바글바글</p>
        <h2 id="login-heading">관리자 로그인</h2>
        <p className="admin-help">등록된 관리자 계정으로 로그인해 주세요.</p>
        <form onSubmit={login}>
          <label>
            이메일
            <input
              type="email"
              name="email"
              autoComplete="username"
              required
              value={email}
              disabled={busy}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <label>
            비밀번호
            <div className="admin-password">
              <input
                type={visible ? "text" : "password"}
                name="password"
                autoComplete="current-password"
                required
                value={password}
                disabled={busy}
                onChange={(event) => setPassword(event.target.value)}
              />
              <button
                type="button"
                aria-label={visible ? "비밀번호 숨기기" : "비밀번호 보기"}
                aria-pressed={visible}
                onClick={() => setVisible(!visible)}
              >
                {visible ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>
          {error && (
            <p className="admin-error" role="alert">
              {error}
            </p>
          )}
          <button
            className="admin-button primary"
            disabled={busy}
            type="submit"
          >
            {busy ? "로그인 중…" : "로그인"}
            <ArrowRight size={17} />
          </button>
        </form>
      </section>
    </main>
  );
}

function AuthenticatedAdmin({ client }: { client: SupabaseClient }) {
  const [state, setState] = useState<{
    status: "loading" | "ready" | "error";
    session: Session | null;
  }>({ status: "loading", session: null });
  const repository = useMemo(() => createAdminRepository(client), [client]);
  useEffect(() => {
    let active = true;
    let eventReceived = false;
    const { data } = client.auth.onAuthStateChange((_event, session) => {
      eventReceived = true;
      if (active) setState({ status: "ready", session });
    });
    client.auth.getSession().then(
      ({ data, error }) => {
        if (active && !eventReceived)
          setState({
            status: error ? "error" : "ready",
            session: data.session,
          });
      },
      () => {
        if (active && !eventReceived)
          setState({ status: "error", session: null });
      },
    );
    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, [client]);
  if (state.status === "loading")
    return (
      <main className="admin-empty" role="status">
        로그인 상태를 확인하고 있어요…
      </main>
    );
  if (state.status === "error")
    return (
      <main className="admin-empty">
        <p role="alert">로그인 상태를 확인하지 못했어요.</p>
        <button className="admin-button" onClick={() => location.reload()}>
          다시 시도
        </button>
      </main>
    );
  if (!state.session || state.session.user.is_anonymous)
    return <Login client={client} />;
  return (
    <AdminWorkspace
      key={state.session.user.id}
      repository={repository}
      email={state.session.user.email ?? "관리자"}
      onLogout={async () => {
        const { error } = await client.auth.signOut({ scope: "local" });
        if (error) throw error;
      }}
    />
  );
}

export default function AdminApp() {
  const [client] = useState(() => {
    try {
      return getAdminClient();
    } catch {
      return null;
    }
  });
  useEffect(() => {
    document.documentElement.lang = "ko";
    document.title = "바글바글 · 관리자";
  }, []);
  if (!client)
    return (
      <main className="admin-empty">
        <h1>관리자 연결 설정이 필요해요</h1>
        <p>Supabase 환경 변수를 확인한 뒤 다시 열어 주세요.</p>
        <a className="admin-button" href="/menu?lang=ko">
          메뉴판으로
        </a>
      </main>
    );
  return <AuthenticatedAdmin client={client} />;
}
