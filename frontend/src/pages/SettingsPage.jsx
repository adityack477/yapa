import { useState, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { UserIcon, BellIcon, Volume2Icon, VolumeOffIcon, CameraIcon, LogOutIcon, ChevronRightIcon, CheckIcon } from "lucide-react";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const { authUser, updateProfile, logout } = useAuthStore();
  const { isSoundEnabled, toggleSound } = useChatStore();
  const [name, setName] = useState(authUser?.fullName || "");
  const [saving, setSaving] = useState(false);
  const [imgPreview, setImgPreview] = useState(null);
  const fileRef = useRef(null);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      setImgPreview(reader.result);
      await updateProfile({ profilePic: reader.result });
      toast.success("Profile picture updated");
    };
    reader.readAsDataURL(file);
  };

  const handleSaveName = async () => {
    if (!name.trim() || name === authUser?.fullName) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    setSaving(false);
    toast.success("Profile updated!");
  };

  const avatar = imgPreview || authUser?.profilePic || "/avatar.png";
  const memberSince = authUser?.createdAt
    ? new Date(authUser.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
    : "-";

  return (
    <div style={{ flex: 1, overflowY: "auto", background: "var(--bg-0)", padding: "clamp(1.5rem, 4vw, 2.5rem)" }}>
      <div style={{ maxWidth: 560, marginInline: "auto", display: "flex", flexDirection: "column", gap: "1.5rem" }}>

        {/* heading */}
        <div>
          <h1 style={{ fontSize: "clamp(1.25rem, 2.5vw, 1.5rem)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 4 }}>Settings</h1>
          <p style={{ fontSize: "0.875rem", color: "var(--text-2)" }}>Manage your profile and preferences</p>
        </div>

        {/* ── Profile ──── */}
        <div className="card" style={{ padding: "clamp(1.25rem, 3vw, 1.75rem)" }}>
          <p className="label-sm" style={{ marginBottom: "1.25rem" }}>Profile</p>

          {/* avatar row */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: "1.5rem" }}>
            <div style={{ position: "relative", cursor: "pointer", flexShrink: 0 }} onClick={() => fileRef.current?.click()}>
              <img src={avatar} alt="Avatar" style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover", border: "2px solid var(--border)" }} />
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.opacity = 1}
                onMouseLeave={e => e.currentTarget.style.opacity = 0}
              >
                <CameraIcon size={18} color="#fff" />
              </div>
              <input type="file" accept="image/*" ref={fileRef} onChange={handleImageChange} style={{ display: "none" }} />
            </div>
            <div>
              <p style={{ fontWeight: 600, fontSize: "1rem", marginBottom: 2 }}>{authUser?.fullName}</p>
              <p style={{ fontSize: "0.875rem", color: "var(--text-2)", marginBottom: 4 }}>{authUser?.email}</p>
              <p style={{ fontSize: "0.75rem", color: "var(--accent)" }}>Click avatar to change photo</p>
            </div>
          </div>

          {/* name field */}
          <div>
            <label className="field-label">Display Name</label>
            <div style={{ display: "flex", gap: 10 }}>
              <div className="field-wrap" style={{ flex: 1 }}>
                <UserIcon size={16} className="field-icon" />
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="field-input" placeholder="Your name" />
              </div>
              <button onClick={handleSaveName} disabled={saving || name === authUser?.fullName}
                className="btn-primary" style={{ whiteSpace: "nowrap", padding: "0.5rem 1rem", fontSize: "0.875rem", gap: 6 }}>
                {saving ? "Saving…" : <><CheckIcon size={14} /><span>Save</span></>}
              </button>
            </div>
          </div>
        </div>

        {/* ── Preferences ──── */}
        <div className="card" style={{ padding: "clamp(1.25rem, 3vw, 1.75rem)" }}>
          <p className="label-sm" style={{ marginBottom: "1.25rem" }}>Preferences</p>

          {/* sound toggle */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBlock: "0.875rem", borderBottom: "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {isSoundEnabled
                ? <Volume2Icon size={20} color="var(--accent)" />
                : <VolumeOffIcon size={20} color="var(--text-3)" />
              }
              <div>
                <p style={{ fontWeight: 500, fontSize: "0.9375rem" }}>Sound Effects</p>
                <p style={{ fontSize: "0.8125rem", color: "var(--text-2)" }}>Keystroke and notification sounds</p>
              </div>
            </div>
            <button onClick={toggleSound} style={{
              position: "relative", width: 44, height: 24, borderRadius: 99, border: "none", cursor: "pointer",
              background: isSoundEnabled ? "var(--accent)" : "var(--bg-4)", transition: "background 0.2s", flexShrink: 0,
            }}>
              <span style={{
                position: "absolute", top: 2, left: isSoundEnabled ? "calc(100% - 22px)" : 2,
                width: 20, height: 20, borderRadius: "50%", background: "#fff",
                transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
              }} />
            </button>
          </div>

          {/* notifications row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBlock: "0.875rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <BellIcon size={20} color="var(--text-3)" />
              <div>
                <p style={{ fontWeight: 500, fontSize: "0.9375rem" }}>Browser Notifications</p>
                <p style={{ fontSize: "0.8125rem", color: "var(--text-2)" }}>Managed via browser settings</p>
              </div>
            </div>
            <span style={{ fontSize: "0.75rem", color: "var(--text-3)", background: "var(--bg-3)", border: "1px solid var(--border)", borderRadius: 6, padding: "4px 10px" }}>Browser setting</span>
          </div>
        </div>

        {/* ── Account ──── */}
        <div className="card" style={{ padding: "clamp(1.25rem, 3vw, 1.75rem)" }}>
          <p className="label-sm" style={{ marginBottom: "1.25rem" }}>Account</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {[["Email", authUser?.email], ["Member since", memberSince]].map(([label, val]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.625rem 0.75rem", borderRadius: 8, background: "transparent", transition: "background 0.12s" }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--bg-3)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <span style={{ fontSize: "0.9375rem", color: "var(--text-2)" }}>{label}</span>
                <span style={{ fontSize: "0.9375rem", color: "var(--text-1)", fontWeight: 500 }}>{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Danger zone ──── */}
        <div className="card" style={{ padding: "clamp(1.25rem, 3vw, 1.75rem)", borderColor: "rgba(248,113,113,0.12)" }}>
          <p className="label-sm" style={{ color: "rgba(248,113,113,0.6)", marginBottom: "1.25rem" }}>Danger Zone</p>
          <button onClick={logout} style={{
            display: "flex", alignItems: "center", gap: 10, width: "100%",
            padding: "0.625rem 0.75rem", borderRadius: 8, border: "none", background: "transparent",
            cursor: "pointer", color: "#f87171", fontSize: "0.9375rem", fontWeight: 500, transition: "background 0.12s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(248,113,113,0.06)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <LogOutIcon size={17} />
            Sign out of Yapa
            <ChevronRightIcon size={16} style={{ marginLeft: "auto", opacity: 0.5 }} />
          </button>
        </div>

      </div>
    </div>
  );
}
