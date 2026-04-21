import { MessageCircleIcon } from "lucide-react";

export default function NoConversationPlaceholder() {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "2rem", background: "var(--bg-0)" }}>
      <div style={{ width: 60, height: 60, borderRadius: 18, background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.18)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>
        <MessageCircleIcon size={28} color="var(--accent)" />
      </div>
      <h3 style={{ fontWeight: 700, fontSize: "1.0625rem", marginBottom: "0.5rem" }}>Select a conversation</h3>
      <p style={{ fontSize: "0.875rem", color: "var(--text-2)", maxWidth: 280, lineHeight: 1.65 }}>
        Pick someone from the sidebar or switch to Contacts to start a new chat.
      </p>
    </div>
  );
}
