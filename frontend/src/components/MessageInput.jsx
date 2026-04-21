import { useRef, useState, useCallback } from "react";
import useKeyboardSound from "../hooks/useKeyboardSound";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";
import { ImageIcon, SendIcon, XIcon } from "lucide-react";

function useDebounce(fn, delay) {
  const timer = useRef(null);
  return useCallback((...args) => { clearTimeout(timer.current); timer.current = setTimeout(() => fn(...args), delay); }, [fn, delay]);
}

export default function MessageInput() {
  const { playRandomKeyStrokeSound } = useKeyboardSound();
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const fileInputRef = useRef(null);
  const { sendMessage, isSoundEnabled, selectedUser } = useChatStore();
  const { socket } = useAuthStore();

  const emitStop = useDebounce(() => {
    if (socket && selectedUser) socket.emit("typingStop", { receiverId: selectedUser._id });
    setIsTyping(false);
  }, 1500);

  const handleChange = (e) => {
    setText(e.target.value);
    if (isSoundEnabled) playRandomKeyStrokeSound();
    if (!isTyping && socket && selectedUser) { socket.emit("typingStart", { receiverId: selectedUser._id }); setIsTyping(true); }
    emitStop();
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;
    if (isSoundEnabled) playRandomKeyStrokeSound();
    if (socket && selectedUser) socket.emit("typingStop", { receiverId: selectedUser._id });
    setIsTyping(false);
    sendMessage({ text: text.trim(), image: imagePreview });
    setText(""); setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file?.type.startsWith("image/")) { toast.error("Please select an image"); return; }
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ padding: "12px 20px 16px", background: "var(--bg-1)", borderTop: "1px solid var(--border)", flexShrink: 0 }}>
      {imagePreview && (
        <div style={{ marginBottom: 10 }}>
          <div style={{ position: "relative", display: "inline-block" }}>
            <img src={imagePreview} alt="Preview" style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 10, border: "1px solid var(--border)" }} />
            <button onClick={() => { setImagePreview(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
              style={{ position: "absolute", top: -6, right: -6, width: 20, height: 20, borderRadius: "50%", background: "var(--bg-2)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--text-2)" }}>
              <XIcon size={11} />
            </button>
          </div>
        </div>
      )}
      <form onSubmit={handleSend} style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} style={{ display: "none" }} />

        <button type="button" onClick={() => fileInputRef.current?.click()} className="btn-icon"
          style={{ flexShrink: 0, color: imagePreview ? "var(--accent)" : "var(--text-3)", background: imagePreview ? "rgba(245,158,11,0.1)" : "transparent" }}>
          <ImageIcon size={19} />
        </button>

        <input type="text" value={text} onChange={handleChange}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) handleSend(e); }}
          style={{
            flex: 1, padding: "0.6875rem 1rem",
            background: "var(--bg-3)", border: "1px solid var(--border)", borderRadius: 10,
            color: "var(--text-1)", fontSize: "0.9375rem", fontFamily: "inherit", outline: "none",
            transition: "border-color 0.15s",
          }}
          placeholder="Message..."
          onFocus={e => e.target.style.borderColor = "rgba(245,158,11,0.45)"}
          onBlur={e => e.target.style.borderColor = "var(--border)"}
        />

        <button type="submit" disabled={!text.trim() && !imagePreview}
          style={{
            flexShrink: 0, width: 38, height: 38, borderRadius: 10, border: "none", cursor: "pointer",
            background: "var(--accent)", color: "#000",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "background 0.15s, transform 0.1s", opacity: (!text.trim() && !imagePreview) ? 0.3 : 1,
          }}
          onMouseEnter={e => { if (!e.currentTarget.disabled) e.currentTarget.style.background = "var(--accent-hover)"; }}
          onMouseLeave={e => e.currentTarget.style.background = "var(--accent)"}
          onMouseDown={e => e.currentTarget.style.transform = "scale(0.93)"}
          onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
        >
          <SendIcon size={17} strokeWidth={2.5} />
        </button>
      </form>
    </div>
  );
}
