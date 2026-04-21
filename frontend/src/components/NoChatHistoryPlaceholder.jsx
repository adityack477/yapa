import { useChatStore } from "../store/useChatStore";
const STARTERS = ["👋 Hey!", "What's up?", "Let's chat!"];
export default function NoChatHistoryPlaceholder({ name }) {
  const { sendMessage } = useChatStore();
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center" }}>
      <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>💬</div>
      <p style={{ fontWeight: 700, fontSize: "1.0625rem", marginBottom: "0.375rem" }}>Start chatting with {name}</p>
      <p style={{ fontSize: "0.875rem", color: "var(--text-2)", marginBottom: "1.5rem" }}>This is the beginning of your conversation</p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
        {STARTERS.map(s => (
          <button key={s} onClick={() => sendMessage({ text: s, image: null })} style={{
            padding: "6px 16px", fontSize: "0.875rem", color: "var(--accent)",
            background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)",
            borderRadius: 99, cursor: "pointer", transition: "background 0.15s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(245,158,11,0.18)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(245,158,11,0.1)"}
          >{s}</button>
        ))}
      </div>
    </div>
  );
}
