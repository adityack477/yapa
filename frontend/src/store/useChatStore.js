import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,
  unreadCounts: {}, // { userId: number }
  typingUsers: new Set(), // set of userIds currently typing

  toggleSound: () => {
    const next = !get().isSoundEnabled;
    localStorage.setItem("isSoundEnabled", next);
    set({ isSoundEnabled: next });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedUser: (user) => set({ selectedUser: user }),

  // ── Contacts ─────────────────────────────────────────────────────────────

  getAllContacts: async () => {
    set({ isUsersLoading: true });
    try {
      const { data } = await axiosInstance.get("/messages/contacts");
      set({ allContacts: data });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load contacts");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMyChatPartners: async () => {
    set({ isUsersLoading: true });
    try {
      const { data } = await axiosInstance.get("/messages/chats");
      set({ chats: data });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load chats");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  // ── Messages ──────────────────────────────────────────────────────────────

  getMessagesByUserId: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const { data } = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: data });
      // clear unread badge for this user
      set((state) => ({
        unreadCounts: { ...state.unreadCounts, [userId]: 0 },
      }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    const { authUser } = useAuthStore.getState();

    // optimistic update so the UI feels instant
    const tempId = `temp-${Date.now()}`;
    const optimistic = {
      _id: tempId,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text: messageData.text,
      image: messageData.image,
      createdAt: new Date().toISOString(),
      reactions: [],
      isOptimistic: true,
    };
    set({ messages: [...messages, optimistic] });

    try {
      const { data } = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      // swap optimistic placeholder with real server response
      set({ messages: get().messages.map((m) => (m._id === tempId ? data : m)) });
    } catch (err) {
      // roll back on failure
      set({ messages: messages });
      toast.error(err.response?.data?.message || "Failed to send message");
    }
  },

  // ── Delete Message ────────────────────────────────────────────────────────

  deleteMessage: async (messageId) => {
    try {
      await axiosInstance.delete(`/messages/${messageId}`);
      set((state) => ({
        messages: state.messages.map((m) =>
          m._id === messageId ? { ...m, deletedAt: new Date().toISOString(), text: null, image: null } : m
        ),
      }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not delete message");
    }
  },

  // ── Emoji Reactions ───────────────────────────────────────────────────────

  reactToMessage: async (messageId, emoji) => {
    try {
      const { data } = await axiosInstance.post(`/messages/${messageId}/react`, { emoji });
      set((state) => ({
        messages: state.messages.map((m) => (m._id === messageId ? data : m)),
      }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add reaction");
    }
  },

  // ── Unread Counts ─────────────────────────────────────────────────────────

  fetchUnreadCounts: async () => {
    try {
      const { data } = await axiosInstance.get("/messages/unread/counts");
      set({ unreadCounts: data });
    } catch (err) {
      console.error("fetchUnreadCounts error:", err.message);
    }
  },

  // ── Socket Subscriptions ──────────────────────────────────────────────────

  subscribeToMessages: () => {
    const { selectedUser, isSoundEnabled } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (msg) => {
      const fromSelected = msg.senderId === selectedUser._id;
      if (!fromSelected) {
        // increment badge for the sender
        set((state) => ({
          unreadCounts: {
            ...state.unreadCounts,
            [msg.senderId]: (state.unreadCounts[msg.senderId] || 0) + 1,
          },
        }));
        return;
      }

      set((state) => ({ messages: [...state.messages, msg] }));

      if (isSoundEnabled) {
        const notif = new Audio("/sounds/notification.mp3");
        notif.currentTime = 0;
        notif.play().catch(() => {});
      }
    });

    socket.on("messageDeleted", ({ messageId }) => {
      set((state) => ({
        messages: state.messages.map((m) =>
          m._id === messageId
            ? { ...m, deletedAt: new Date().toISOString(), text: null, image: null }
            : m
        ),
      }));
    });

    socket.on("reactionUpdated", ({ messageId, reactions }) => {
      set((state) => ({
        messages: state.messages.map((m) =>
          m._id === messageId ? { ...m, reactions } : m
        ),
      }));
    });

    socket.on("userTyping", ({ senderId }) => {
      if (senderId !== selectedUser._id) return;
      set((state) => ({ typingUsers: new Set([...state.typingUsers, senderId]) }));
    });

    socket.on("userStoppedTyping", ({ senderId }) => {
      set((state) => {
        const next = new Set(state.typingUsers);
        next.delete(senderId);
        return { typingUsers: next };
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
    socket.off("messageDeleted");
    socket.off("reactionUpdated");
    socket.off("userTyping");
    socket.off("userStoppedTyping");
  },
}));
