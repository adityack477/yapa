import { useState, useRef, useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { Trash2Icon, SmileIcon } from "lucide-react";

const EMOJI_OPTIONS = ["❤️", "😂", "😮", "😢", "👍", "🔥"];

export default function MessageBubble({ message, isOwn }) {
  const { deleteMessage, reactToMessage } = useChatStore();
  const [showActions, setShowActions] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef(null);
  const isDeleted = !!message.deletedAt;

  useEffect(() => {
    const close = e => { if (pickerRef.current && !pickerRef.current.contains(e.target)) setShowPicker(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const reactionMap = {};
  (message.reactions || []).forEach(({ emoji }) => { reactionMap[emoji] = (reactionMap[emoji] || 0) + 1; });
  const reactionEntries = Object.entries(reactionMap);
  const time = new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div style={{ display: "flex", justifyContent: isOwn ? "flex-end" : "flex-start", position: "relative" }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => { setShowActions(false); setShowPicker(false); }}
    >
      <div style={{ position: "relative", maxWidth: "min(75%, 460px)" }}>
        {/* action buttons */}
        {!isDeleted && showActions && (
          <div style={{ position: "absolute", top: 4, zIndex: 20, display: "flex", gap: 4, ...(isOwn ? { right: "100%", marginRight: 8 } : { left: "100%", marginLeft: 8 }) }}>
            <div ref={pickerRef} style={{ position: "relative" }}>
              <button onClick={() => setShowPicker(p => !p)} className="btn-icon"
                style={{ width: 30, height: 30, borderRadius: 8, background: "var(--bg-2)", border: "1px solid var(--border)" }}>
                <SmileIcon size={14} />
              </button>
              {showPicker && (
                <div style={{
                  position: "absolute", bottom: 38, display: "flex", gap: 4, padding: 8,
                  background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 12,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                  ...(isOwn ? { right: 0 } : { left: 0 }),
                }}>
                  {EMOJI_OPTIONS.map(emoji => (
                    <button key={emoji} onClick={() => { reactToMessage(message._id, emoji); setShowPicker(false); }}
                      style={{ fontSize: "1.125rem", background: "none", border: "none", cursor: "pointer", padding: "2px 3px", borderRadius: 6, transition: "transform 0.1s" }}
                      onMouseEnter={e => e.currentTarget.style.transform = "scale(1.3)"}
                      onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                    >{emoji}</button>
                  ))}
                </div>
              )}
            </div>
            {isOwn && (
              <button onClick={() => deleteMessage(message._id)} className="btn-icon"
                style={{ width: 30, height: 30, borderRadius: 8, background: "var(--bg-2)", border: "1px solid var(--border)" }}
                onMouseEnter={e => { e.currentTarget.style.color = "#f87171"; e.currentTarget.style.borderColor = "rgba(248,113,113,0.3)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "var(--text-3)"; e.currentTarget.style.borderColor = "var(--border)"; }}
              >
                <Trash2Icon size={13} />
              </button>
            )}
          </div>
        )}

        {/* bubble */}
        <div className={isDeleted ? "" : isOwn ? "bubble-own" : "bubble-other"}
          style={{
            padding: "10px 14px", fontSize: "0.9375rem", lineHeight: 1.5,
            ...(isDeleted ? {
              background: "var(--bg-2)", border: "1px solid var(--border)",
              borderRadius: 16, fontStyle: "italic", color: "var(--text-3)"
            } : {})
          }}
        >
          {isDeleted ? (
            <p style={{ margin: 0 }}>Message deleted</p>
          ) : (
            <>
              {message.image && (
                <img src={message.image} alt="Shared"
                  style={{ borderRadius: 10, maxHeight: 220, objectFit: "cover", width: "100%", display: "block", marginBottom: message.text ? 8 : 0 }} />
              )}
              {message.text && <p style={{ margin: 0 }}>{message.text}</p>}
            </>
          )}
          <p style={{ margin: "4px 0 0", fontSize: "0.6875rem", opacity: 0.5, textAlign: isOwn ? "right" : "left" }}>
            {time}
          </p>
        </div>

        {/* reactions */}
        {reactionEntries.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 5, justifyContent: isOwn ? "flex-end" : "flex-start" }}>
            {reactionEntries.map(([emoji, count]) => (
              <button key={emoji} onClick={() => reactToMessage(message._id, emoji)}
                style={{ display: "flex", alignItems: "center", gap: 3, padding: "2px 8px", fontSize: "0.8125rem", background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 99, cursor: "pointer", transition: "border-color 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(245,158,11,0.3)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
              >
                <span>{emoji}</span>
                {count > 1 && <span style={{ color: "var(--text-3)", fontSize: "0.75rem" }}>{count}</span>}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
