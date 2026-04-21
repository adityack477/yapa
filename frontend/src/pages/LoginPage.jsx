import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { MessageCircleIcon, MailIcon, LoaderIcon, LockIcon, ArrowRightIcon } from "lucide-react";
import { Link } from "react-router";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login, isLoggingIn } = useAuthStore();

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-0)", display: "flex" }}>

      {/* ── Left: form panel ─────────────────── */}
      <div style={{ flex: "1 1 0", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "clamp(2rem, 5vw, 4rem)", minWidth: 0 }}>
        <div style={{ width: "100%", maxWidth: 420 }}>

          {/* logo */}
          <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: "3rem", textDecoration: "none", color: "inherit" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <MessageCircleIcon size={18} color="#000" strokeWidth={2.5} />
            </div>
            <span style={{ fontSize: "1.125rem", fontWeight: 800, letterSpacing: "-0.02em" }}>Yapa</span>
          </Link>

          <h1 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, letterSpacing: "-0.025em", marginBottom: "0.375rem" }}>Welcome back</h1>
          <p style={{ color: "var(--text-2)", fontSize: "0.9375rem", marginBottom: "2.25rem" }}>Sign in to continue your conversations</p>

          <form onSubmit={(e) => { e.preventDefault(); login(form); }} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <label className="field-label">Email</label>
              <div className="field-wrap">
                <MailIcon size={16} className="field-icon" />
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                  className="field-input" placeholder="you@example.com" required />
              </div>
            </div>

            <div>
              <label className="field-label">Password</label>
              <div className="field-wrap">
                <LockIcon size={16} className="field-icon" />
                <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                  className="field-input" placeholder="••••••••" required />
              </div>
            </div>

            <button type="submit" disabled={isLoggingIn} className="btn-primary" style={{ marginTop: "0.25rem", width: "100%", justifyContent: "center" }}>
              {isLoggingIn ? <LoaderIcon size={18} style={{ animation: "spin 1s linear infinite" }} /> : <><span>Sign In</span><ArrowRightIcon size={16} /></>}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: "0.9375rem", color: "var(--text-2)", marginTop: "1.75rem" }}>
            Don't have an account?{" "}
            <Link to="/signup" style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>Create one free</Link>
          </p>
        </div>
      </div>

      {/* ── Right: branding panel ─────────────── */}
      <div style={{
        flex: "1 1 0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        background: "var(--bg-1)", borderLeft: "1px solid var(--border)",
        padding: "clamp(2rem, 6vw, 5rem)",
        position: "relative", overflow: "hidden",
        minWidth: 0,
      }}
        className="auth-panel-right"
      >
        {/* bg glows */}
        <div style={{ position: "absolute", top: "-5%", right: "-5%", width: "50%", paddingBottom: "50%", background: "radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-5%", left: "-5%", width: "40%", paddingBottom: "40%", background: "radial-gradient(circle, rgba(251,146,60,0.07) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />

        <div style={{ position: "relative", textAlign: "center", maxWidth: 380 }}>
          <div style={{ width: 72, height: 72, borderRadius: 22, background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", marginInline: "auto", marginBottom: "1.75rem", boxShadow: "0 0 60px rgba(245,158,11,0.25)" }}>
            <MessageCircleIcon size={36} color="#000" strokeWidth={2.5} />
          </div>
          <h2 style={{ fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: "0.875rem" }}>
            Good to see you again
          </h2>
          <p style={{ color: "var(--text-2)", fontSize: "0.9375rem", lineHeight: 1.7, marginBottom: "2.5rem" }}>
            Your conversations are waiting. Real-time, fast, and clutter-free.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", textAlign: "left" }}>
            {["End-to-end JWT sessions", "Messages in milliseconds", "Your data is never sold"].map(t => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "0.875rem", color: "var(--text-2)" }}>
                <span style={{ color: "var(--accent)", fontSize: "1rem", lineHeight: 1 }}>✦</span>
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 767px) { .auth-panel-right { display: none !important; } }
      `}</style>
    </div>
  );
}
