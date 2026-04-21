import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getAllContacts,
  getChatPartners,
  getMessagesByUserId,
  sendMessage,
  deleteMessage,
  reactToMessage,
  getUnreadCounts,
} from "../controllers/message.controller.js";

const router = express.Router();

// static routes MUST come before dynamic /:id routes
router.get("/contacts", protectRoute, getAllContacts);
router.get("/chats", protectRoute, getChatPartners);
router.get("/unread/counts", protectRoute, getUnreadCounts);

// dynamic routes
router.get("/:id", protectRoute, getMessagesByUserId);
router.post("/send/:id", protectRoute, sendMessage);
router.delete("/:id", protectRoute, deleteMessage);
router.post("/:id/react", protectRoute, reactToMessage);

export default router;
