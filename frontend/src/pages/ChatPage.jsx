import { useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import ChatsList from "../components/ChatsList";
import ContactList from "../components/ContactList";
import ChatContainer from "../components/ChatContainer";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";
import SettingsPage from "./SettingsPage";
import { MessageCircleIcon, UsersIcon, SettingsIcon, LogOutIcon, Volume2Icon, VolumeOffIcon } from "lucide-react";

const NAV = [
  { id: "chats",    Icon: MessageCircleIcon, label: "Messages"  },
  { id: "contacts", Icon: UsersIcon,          label: "Contacts"  },
  { id: "settings", Icon: SettingsIcon,       label: "Settings"  },
];

export default function ChatPage() {
  const { selectedUser, setSelectedUser, unreadCounts, isSoundEnabled, toggleSound } = useChatStore();
  const { authUser, logout } = useAuthStore();
  const [activeNav, setActiveNav] = useState("chats");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const totalUnread = Object.values(unreadCounts).reduce((a, b) => a + b, 0);
  const avatar = authUser?.profilePic || "/avatar.png";

  const handleNav = (id) => {
    setActiveNav(id);
    setSidebarOpen(true);
    if (id !== "chats" && id !== "contacts") setSelectedUser(null);
  };

  const showSidebar = activeNav === "chats" || activeNav === "contacts";

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw", background: "var(--bg-0)", overflow: "hidden" }}>

      {/* ── Icon rail ────────────────────── */}
      <aside style={{
        width: 64, flexShrink: 0,
        display: "flex", flexDirection: "column", alignItems: "center",
        paddingBlock: "14px", gap: 4,
        background: "var(--bg-1)",
        borderRight: "1px solid var(--border)",
        zIndex: 10,
      }}>
        {/* logo */}
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10, flexShrink: 0 }}>
          <MessageCircleIcon size={18} color="#000" strokeWidth={2.5} />
        </div>

        {/* nav buttons */}
        {NAV.map(({ id, Icon, label }) => {
          const isActive = activeNav === id;
          return (
            <button key={id} onClick={() => handleNav(id)} title={label} style={{
              position: "relative", width: 40, height: 40, borderRadius: 10,
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "none", cursor: "pointer", transition: "background 0.15s, color 0.15s",
              background: isActive ? "rgba(245,158,11,0.15)" : "transparent",
              color: isActive ? "var(--accent)" : "var(--text-3)",
            }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = "var(--bg-3)"; e.currentTarget.style.color = "var(--text-2)"; } }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-3)"; } }}
            >
              <Icon size={20} />
              {id === "chats" && totalUnread > 0 && (
                <span className="badge" style={{ position: "absolute", top: 2, right: 2, minWidth: 16, height: 16, fontSize: 9 }}>
                  {totalUnread > 9 ? "9+" : totalUnread}
                </span>
              )}
            </button>
          );
        })}

        <div style={{ flex: 1 }} />

        {/* sound toggle */}
        <button onClick={toggleSound} title={isSoundEnabled ? "Mute" : "Unmute"} className="btn-icon" style={{ width: 40, height: 40 }}>
          {isSoundEnabled ? <Volume2Icon size={18} /> : <VolumeOffIcon size={18} />}
        </button>

        {/* logout */}
        <button onClick={logout} title="Sign out" className="btn-icon" style={{ width: 40, height: 40 }}
          onMouseEnter={e => { e.currentTarget.style.color = "#f87171"; e.currentTarget.style.background = "rgba(248,113,113,0.08)"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "var(--text-3)"; e.currentTarget.style.background = "transparent"; }}
        >
          <LogOutIcon size={18} />
        </button>

        {/* avatar */}
        <img src={avatar} alt="Me" onClick={() => handleNav("settings")} title="Settings"
          style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover", cursor: "pointer", border: "1px solid var(--border)", marginTop: 6, flexShrink: 0, transition: "border-color 0.15s" }}
          onMouseEnter={e => e.target.style.borderColor = "var(--accent)"}
          onMouseLeave={e => e.target.style.borderColor = "var(--border)"}
        />
      </aside>

      {/* ── Sidebar panel ────────────────── */}
      {showSidebar && (
        <div style={{
          width: "clamp(240px, 22vw, 300px)", flexShrink: 0,
          display: "flex", flexDirection: "column",
          background: "var(--bg-1)", borderRight: "1px solid var(--border)",
          overflow: "hidden",
        }}>
          {/* header */}
          <div style={{ padding: "20px 16px 14px", borderBottom: "1px solid var(--border)" }}>
            <h2 style={{ fontWeight: 700, fontSize: "1.0625rem", letterSpacing: "-0.01em", marginBottom: 3 }}>
              {activeNav === "chats" ? "Messages" : "Contacts"}
            </h2>
            <p style={{ fontSize: "0.8125rem", color: "var(--text-3)" }}>
              {activeNav === "chats" ? "Your recent conversations" : "Everyone on Yapa"}
            </p>
          </div>
          {/* list */}
          <div style={{ flex: 1, overflowY: "auto", padding: "10px 10px" }}>
            {activeNav === "chats" ? <ChatsList /> : <ContactList />}
          </div>
        </div>
      )}

      {/* ── Main content ─────────────────── */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
        {activeNav === "settings" ? (
          <SettingsPage />
        ) : selectedUser ? (
          <ChatContainer />
        ) : (
          <NoConversationPlaceholder />
        )}
      </main>
    </div>
  );
}
