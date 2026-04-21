import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

function SkeletonItem() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 8px" }}>
      <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--bg-3)", flexShrink: 0, animation: "pulse 1.5s ease-in-out infinite" }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ height: 13, width: "60%", borderRadius: 6, background: "var(--bg-3)", animation: "pulse 1.5s ease-in-out infinite" }} />
        <div style={{ height: 11, width: "35%", borderRadius: 6, background: "var(--bg-3)", animation: "pulse 1.5s ease-in-out infinite" }} />
      </div>
    </div>
  );
}

export default function ChatsList() {
  const { getMyChatPartners, fetchUnreadCounts, chats, isUsersLoading, setSelectedUser, selectedUser, unreadCounts } = useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => { getMyChatPartners(); fetchUnreadCounts(); }, [getMyChatPartners, fetchUnreadCounts]);

  if (isUsersLoading) return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {[1,2,3].map(i => <SkeletonItem key={i} />)}
      <style>{`@keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:.7} }`}</style>
    </div>
  );

  if (chats.length === 0) return (
    <div style={{ padding: "2.5rem 1rem", textAlign: "center" }}>
      <p style={{ color: "var(--text-3)", fontSize: "0.875rem", marginBottom: 4 }}>No chats yet</p>
      <p style={{ color: "var(--text-3)", fontSize: "0.8125rem" }}>Go to Contacts to start one</p>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {chats.map(chat => {
        const isActive = selectedUser?._id === chat._id;
        const isOnline = onlineUsers.includes(chat._id);
        const unread = unreadCounts[chat._id] || 0;
        return (
          <button key={chat._id} onClick={() => setSelectedUser(chat)} className={`nav-item ${isActive ? "active" : ""}`}>
            <div style={{ position: "relative", flexShrink: 0 }}>
              <img src={chat.profilePic || "/avatar.png"} alt={chat.fullName}
                style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }} />
              {isOnline && (
                <span style={{ position: "absolute", bottom: 0, right: 0, width: 9, height: 9, borderRadius: "50%", background: "#4ade80", border: "2px solid var(--bg-1)" }} />
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-1)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {chat.fullName}
              </p>
              <p style={{ fontSize: "0.75rem", color: isOnline ? "#4ade80" : "var(--text-3)" }}>
                {isOnline ? "Online" : "Offline"}
              </p>
            </div>
            {unread > 0 && <span className="badge">{unread > 9 ? "9+" : unread}</span>}
          </button>
        );
      })}
    </div>
  );
}
