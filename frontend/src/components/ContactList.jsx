import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

export default function ContactList() {
  const { getAllContacts, allContacts, setSelectedUser, selectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();
  useEffect(() => { getAllContacts(); }, [getAllContacts]);

  if (isUsersLoading) return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {[1,2,3,4].map(i => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 8px" }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--bg-3)", flexShrink: 0, animation: "pulse 1.5s ease-in-out infinite" }} />
          <div style={{ height: 13, width: "50%", borderRadius: 6, background: "var(--bg-3)", animation: "pulse 1.5s ease-in-out infinite" }} />
        </div>
      ))}
      <style>{`@keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:.7} }`}</style>
    </div>
  );

  if (allContacts.length === 0) return (
    <div style={{ padding: "2.5rem 1rem", textAlign: "center" }}>
      <p style={{ color: "var(--text-3)", fontSize: "0.875rem" }}>No other users yet</p>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {allContacts.map(contact => {
        const isActive = selectedUser?._id === contact._id;
        const isOnline = onlineUsers.includes(contact._id);
        return (
          <button key={contact._id} onClick={() => setSelectedUser(contact)} className={`nav-item ${isActive ? "active" : ""}`}>
            <div style={{ position: "relative", flexShrink: 0 }}>
              <img src={contact.profilePic || "/avatar.png"} alt={contact.fullName}
                style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }} />
              {isOnline && <span style={{ position: "absolute", bottom: 0, right: 0, width: 9, height: 9, borderRadius: "50%", background: "#4ade80", border: "2px solid var(--bg-1)" }} />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-1)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{contact.fullName}</p>
              <p style={{ fontSize: "0.75rem", color: isOnline ? "#4ade80" : "var(--text-3)" }}>{isOnline ? "Online" : "Offline"}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
