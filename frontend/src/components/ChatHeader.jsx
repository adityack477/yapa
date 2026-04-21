import { XIcon } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";

export default function ChatHeader() {
  const { selectedUser, setSelectedUser, typingUsers } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const isOnline  = onlineUsers.includes(selectedUser._id);
  const isTyping  = typingUsers.has(selectedUser._id);

  useEffect(() => {
    const fn = e => { if (e.key === "Escape") setSelectedUser(null); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [setSelectedUser]);

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", background: "var(--bg-1)", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ position: "relative", flexShrink: 0 }}>
          <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName}
            style={{ width: 38, height: 38, borderRadius: "50%", objectFit: "cover" }} />
          {isOnline && (
            <span style={{ position: "absolute", bottom: 0, right: 0, width: 10, height: 10, borderRadius: "50%", background: "#4ade80", border: "2px solid var(--bg-1)" }} />
          )}
        </div>
        <div>
          <p style={{ fontWeight: 600, fontSize: "0.9375rem", lineHeight: 1.2 }}>{selectedUser.fullName}</p>
          {isTyping ? (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
                <div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" />
              </div>
              <span style={{ fontSize: "0.75rem", color: "var(--accent)" }}>typing</span>
            </div>
          ) : (
            <p style={{ fontSize: "0.75rem", color: isOnline ? "#4ade80" : "var(--text-3)" }}>
              {isOnline ? "Online" : "Offline"}
            </p>
          )}
        </div>
      </div>
      <button onClick={() => setSelectedUser(null)} className="btn-icon">
        <XIcon size={18} />
      </button>
    </div>
  );
}
