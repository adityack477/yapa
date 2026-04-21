import { useEffect, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageInput from "./MessageInput";
import MessageBubble from "./MessageBubble";

export default function ChatContainer() {
  const { selectedUser, getMessagesByUserId, messages, isMessagesLoading, subscribeToMessages, unsubscribeFromMessages } = useChatStore();
  const { authUser } = useAuthStore();
  const bottomRef = useRef(null);

  useEffect(() => {
    getMessagesByUserId(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser, getMessagesByUserId, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--bg-0)", overflow: "hidden" }}>
      <ChatHeader />

      <div style={{ flex: 1, overflowY: "auto", padding: "clamp(1rem, 3vw, 1.75rem)" }}>
        {isMessagesLoading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 680, marginInline: "auto" }}>
            {[1,2,3,4].map(i => (
              <div key={i} style={{ display: "flex", justifyContent: i%2===0 ? "flex-end" : "flex-start" }}>
                <div style={{ height: 42, width: i%2===0 ? 160 : 220, borderRadius: 18, background: "var(--bg-3)", animation: "pulse 1.5s ease-in-out infinite" }} />
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <NoChatHistoryPlaceholder name={selectedUser.fullName} />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 680, marginInline: "auto" }}>
            {messages.map(msg => (
              <MessageBubble key={msg._id} message={msg} isOwn={msg.senderId === authUser._id} />
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <MessageInput />
      <style>{`@keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:.7} }`}</style>
    </div>
  );
}
