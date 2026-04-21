import { Link } from "react-router";
import {
  MessageCircleIcon, ZapIcon, ShieldIcon, SmileIcon,
  UsersIcon, BellIcon, ImageIcon, ArrowRightIcon, CheckIcon,
  TrashIcon
} from "lucide-react";

const FEATURES = [
  { icon: ZapIcon,           title: "Real-Time Messaging",  desc: "Socket.io delivers messages instantly - no polling, no delays.", color: "#f59e0b", bg: "rgba(245,158,11,0.1)"  },
  { icon: SmileIcon,         title: "Emoji Reactions",      desc: "React to messages with emojis. Syncs live across both clients.",  color: "#fb923c", bg: "rgba(251,146,60,0.1)"  },
  { icon: BellIcon,          title: "Typing Indicators",    desc: "Animated dots show when someone's typing, debounced perfectly.", color: "#facc15", bg: "rgba(250,204,21,0.1)"  },
  { icon: ImageIcon,         title: "Image Sharing",        desc: "Send photos in chat. Stored via Cloudinary CDN globally.",        color: "#f59e0b", bg: "rgba(245,158,11,0.1)"  },
  { icon: ShieldIcon,        title: "Secure Auth",          desc: "JWT via HTTP-only cookies. bcrypt hashing. Arcjet rate limiting.", color: "#4ade80", bg: "rgba(74,222,128,0.1)"  },
  { icon: TrashIcon,         title: "Message Deletion",     desc: "Delete your own messages. State propagates in real time.",         color: "#f87171", bg: "rgba(248,113,113,0.1)" },
];

const STEPS = [
  { n: "01", title: "Create an account",  desc: "Sign up in seconds - just name, email, password." },
  { n: "02", title: "Find contacts",      desc: "Browse everyone on Yapa in the Contacts tab."      },
  { n: "03", title: "Start Yapping",      desc: "Text, react, share images. All in real time."      },
];

const PERKS = [
  "No ads, ever", "Completely free", "No phone number needed",
  "Unread message badges", "Message deletion", "Sound effects toggle",
];

export default function LandingPage() {
  return (
    <div style={{ background: "var(--bg-0)", color: "var(--text-1)", minHeight: "100vh" }}>

      {/* ── Navbar ───────────────────────────── */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        borderBottom: "1px solid var(--border)",
        background: "rgba(10,10,10,0.85)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}>
        <div className="container-xl" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px" }}>
          {/* logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <MessageCircleIcon size={18} color="#000" strokeWidth={2.5} />
            </div>
            <span style={{ fontSize: "1.125rem", fontWeight: 800, letterSpacing: "-0.02em" }}>Yapa</span>
          </div>

          {/* nav links */}
          <nav style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Link to="/login" className="btn-ghost" style={{ fontSize: "0.875rem" }}>Sign In</Link>
            <Link to="/signup" className="btn-primary" style={{ padding: "0.5rem 1.25rem", fontSize: "0.875rem", borderRadius: "8px" }}>
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────── */}
      <section style={{ paddingTop: "clamp(7rem, 12vw, 10rem)", paddingBottom: "clamp(4rem, 8vw, 7rem)", position: "relative", overflow: "hidden" }}>
        {/* bg glows */}
        <div style={{ position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)", width: "min(800px, 100vw)", height: 400, background: "radial-gradient(ellipse, rgba(245,158,11,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "20%", left: "5%", width: 300, height: 300, background: "rgba(251,146,60,0.06)", borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "30%", right: "5%", width: 250, height: 250, background: "rgba(245,158,11,0.06)", borderRadius: "50%", filter: "blur(60px)", pointerEvents: "none" }} />

        <div className="container-md" style={{ textAlign: "center", position: "relative" }}>
          {/* pill badge */}
          <div className="animate-fade-up" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 99, background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.25)", marginBottom: "2rem" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--accent)" }}>Real-time · MERN Stack · Free Forever</span>
          </div>

          <h1 className="display-xl animate-fade-up delay-100" style={{ marginBottom: "1.5rem" }}>
            Chat without<br />
            <span style={{ color: "var(--accent)" }}>the noise</span>
          </h1>

          <p className="body-lg animate-fade-up delay-200" style={{ maxWidth: 560, marginInline: "auto", marginBottom: "2.5rem" }}>
            Yapa is a fast, clean, real-time messaging app. No clutter, no algorithms, no ads - just conversations that feel instant.
          </p>

          <div className="animate-fade-up delay-300" style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
            <Link to="/signup" className="btn-primary">
              Start for free <ArrowRightIcon size={16} />
            </Link>
            <Link to="/login" className="btn-secondary">
              Sign in
            </Link>
          </div>
        </div>

        {/* mock chat UI */}
        <div className="container-md animate-fade-up" style={{ marginTop: "4rem", position: "relative" }}>
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "40%", background: "linear-gradient(to top, var(--bg-0), transparent)", zIndex: 2, pointerEvents: "none", borderRadius: "0 0 16px 16px" }} />
          <div className="card glow-amber" style={{ overflow: "hidden", maxWidth: 640, marginInline: "auto" }}>
            {/* chat header */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", borderBottom: "1px solid var(--border)", background: "var(--bg-1)" }}>
              <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#f59e0b,#d97706)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 15, color: "#000", flexShrink: 0 }}>R</div>
              <div>
                <p style={{ fontWeight: 600, fontSize: "0.9375rem", lineHeight: 1.2 }}>Rahul Sharma</p>
                <p style={{ fontSize: "0.75rem", color: "#4ade80" }}>Online</p>
              </div>
            </div>
            {/* messages */}
            <div style={{ padding: "20px", background: "var(--bg-1)", display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div className="bubble-other" style={{ padding: "10px 14px", fontSize: "0.9375rem", maxWidth: "75%" }}>
                  Hey! Have you tried Yapa yet? 👀
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <div className="bubble-own" style={{ padding: "10px 14px", fontSize: "0.9375rem", maxWidth: "75%" }}>
                  Just signed up - this is so clean 🔥
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-start", flexDirection: "column", gap: 6, alignItems: "flex-start" }}>
                <div className="bubble-other" style={{ padding: "10px 14px", fontSize: "0.9375rem", maxWidth: "75%" }}>
                  Right?! The reactions are 🤌
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <span style={{ fontSize: "0.75rem", background: "var(--bg-3)", border: "1px solid var(--border)", borderRadius: 99, padding: "2px 10px" }}>❤️ 2</span>
                  <span style={{ fontSize: "0.75rem", background: "var(--bg-3)", border: "1px solid var(--border)", borderRadius: 99, padding: "2px 10px" }}>🔥 1</span>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <div className="bubble-own" style={{ padding: "10px 14px", fontSize: "0.9375rem", maxWidth: "75%" }}>
                  Okay I'm switching from WhatsApp lol
                </div>
              </div>
              {/* typing */}
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div className="bubble-other" style={{ padding: "12px 16px", display: "flex", gap: 5, alignItems: "center" }}>
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────── */}
      <section style={{ paddingBlock: "clamp(4rem, 8vw, 6rem)", borderTop: "1px solid var(--border)" }}>
        <div className="container-xl">
          <div style={{ textAlign: "center", marginBottom: "clamp(2.5rem, 5vw, 4rem)" }}>
            <h2 className="display-lg" style={{ marginBottom: "1rem" }}>Everything you need</h2>
            <p className="body-lg" style={{ maxWidth: 500, marginInline: "auto" }}>
              Built with the MERN stack and Socket.io - fast, scalable, and feature-complete.
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
            gap: "clamp(12px, 2vw, 20px)",
          }}>
            {FEATURES.map(({ icon: Icon, title, desc, color, bg }) => (
              <div key={title} className="card card-hover" style={{ padding: "clamp(1.25rem, 3vw, 1.75rem)" }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
                  <Icon size={22} color={color} />
                </div>
                <h3 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "0.5rem" }}>{title}</h3>
                <p style={{ fontSize: "0.875rem", color: "var(--text-2)", lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────── */}
      <section style={{ paddingBlock: "clamp(4rem, 8vw, 6rem)", borderTop: "1px solid var(--border)" }}>
        <div className="container-xl">
          <div style={{ textAlign: "center", marginBottom: "clamp(2.5rem, 5vw, 4rem)" }}>
            <h2 className="display-lg" style={{ marginBottom: "1rem" }}>Up in 30 seconds</h2>
            <p className="body-lg" style={{ maxWidth: 440, marginInline: "auto" }}>No setup, no config. Just create and chat.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))", gap: "clamp(2rem, 4vw, 3rem)", textAlign: "center" }}>
            {STEPS.map(({ n, title, desc }) => (
              <div key={n}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", color: "var(--accent)", fontFamily: "monospace", fontWeight: 700, fontSize: "0.9375rem", display: "flex", alignItems: "center", justifyContent: "center", marginInline: "auto", marginBottom: "1.25rem" }}>
                  {n}
                </div>
                <h3 style={{ fontWeight: 700, fontSize: "1.0625rem", marginBottom: "0.5rem" }}>{title}</h3>
                <p style={{ fontSize: "0.875rem", color: "var(--text-2)", lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Perks ────────────────────────────── */}
      <section style={{ paddingBlock: "clamp(4rem, 8vw, 6rem)", borderTop: "1px solid var(--border)" }}>
        <div className="container-md" style={{ textAlign: "center" }}>
          <h2 className="display-lg" style={{ marginBottom: "1rem" }}>
            Actually free. <span style={{ color: "var(--accent)" }}>No catch.</span>
          </h2>
          <p className="body-lg" style={{ marginBottom: "2.5rem", maxWidth: 420, marginInline: "auto" }}>
            No premium tier, no message limits, no data selling.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))", gap: "0.875rem", textAlign: "left", maxWidth: 560, marginInline: "auto" }}>
            {PERKS.map(p => (
              <div key={p} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "0.9375rem", color: "var(--text-2)" }}>
                <CheckIcon size={16} color="var(--accent)" style={{ flexShrink: 0 }} />
                {p}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────── */}
      <section style={{ paddingBlock: "clamp(4rem, 8vw, 7rem)", borderTop: "1px solid var(--border)" }}>
        <div className="container-sm" style={{ textAlign: "center" }}>
          <div style={{ width: 60, height: 60, borderRadius: 18, background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", marginInline: "auto", marginBottom: "1.75rem" }}>
            <MessageCircleIcon size={30} color="#000" strokeWidth={2.5} />
          </div>
          <h2 className="display-lg" style={{ marginBottom: "1rem" }}>Ready to Yapa?</h2>
          <p className="body-lg" style={{ marginBottom: "2rem" }}>Join and start chatting in under a minute.</p>
          <Link to="/signup" className="btn-primary" style={{ fontSize: "1rem", padding: "0.875rem 2.25rem" }}>
            Create free account <ArrowRightIcon size={18} />
          </Link>
        </div>
      </section>

      {/* ── Footer ───────────────────────────── */}
      <footer style={{ borderTop: "1px solid var(--border)", paddingBlock: "1.75rem" }}>
        <div className="container-xl" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <MessageCircleIcon size={13} color="#000" strokeWidth={2.5} />
            </div>
            <span style={{ fontWeight: 700, fontSize: "0.9375rem" }}>Yapa</span>
          </div>
          <p style={{ fontSize: "0.8125rem", color: "var(--text-3)" }}>
            Built with MERN + Socket.io · © 2026 Aditya Kadam
          </p>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            <Link to="/login"  style={{ fontSize: "0.8125rem", color: "var(--text-3)", textDecoration: "none" }} onMouseEnter={e=>e.target.style.color="var(--text-1)"} onMouseLeave={e=>e.target.style.color="var(--text-3)"}>Sign In</Link>
            <Link to="/signup" style={{ fontSize: "0.8125rem", color: "var(--text-3)", textDecoration: "none" }} onMouseEnter={e=>e.target.style.color="var(--text-1)"} onMouseLeave={e=>e.target.style.color="var(--text-3)"}>Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
