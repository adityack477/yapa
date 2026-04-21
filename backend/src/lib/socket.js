import { Server } from "socket.io";
import http from "http";
import express from "express";
import { ENV } from "./env.js";
import { socketAuthMiddleware } from "../middleware/socket.auth.middleware.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [ENV.CLIENT_URL],
    credentials: true,
  },
});

// authenticate every socket connection before it can do anything
io.use(socketAuthMiddleware);

// maps userId -> socketId so we can send targeted events
const onlineUsers = {}; // { userId: socketId }

export function getReceiverSocketId(userId) {
  return onlineUsers[userId];
}

io.on("connection", (socket) => {
  const userId = socket.userId;
  onlineUsers[userId] = socket.id;

  console.log(`[socket] ${socket.user.fullName} connected`);

  // broadcast updated online list to everyone
  io.emit("getOnlineUsers", Object.keys(onlineUsers));

  // ── Typing indicators ──────────────────────────────────────────────────
  socket.on("typingStart", ({ receiverId }) => {
    const receiverSocketId = onlineUsers[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("userTyping", { senderId: userId });
    }
  });

  socket.on("typingStop", ({ receiverId }) => {
    const receiverSocketId = onlineUsers[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("userStoppedTyping", { senderId: userId });
    }
  });

  // ── Disconnect ─────────────────────────────────────────────────────────
  socket.on("disconnect", () => {
    console.log(`[socket] ${socket.user.fullName} disconnected`);
    delete onlineUsers[userId];
    io.emit("getOnlineUsers", Object.keys(onlineUsers));
  });
});

export { io, app, server };
