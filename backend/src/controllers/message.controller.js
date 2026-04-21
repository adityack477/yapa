import cloudinary, { cloudinaryConfigured } from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/Message.js";
import User from "../models/User.js";

// ─── Contacts & Chat Partners ──────────────────────────────────────────────

export const getAllContacts = async (req, res) => {
  try {
    const myId = req.user._id;
    const users = await User.find({ _id: { $ne: myId } }).select("-password");
    res.status(200).json(users);
  } catch (err) {
    console.error("getAllContacts error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const getChatPartners = async (req, res) => {
  try {
    const myId = req.user._id;

    const allMessages = await Message.find({
      $or: [{ senderId: myId }, { receiverId: myId }],
    });

    // collect unique partner IDs
    const partnerIds = [
      ...new Set(
        allMessages.map((msg) =>
          msg.senderId.toString() === myId.toString()
            ? msg.receiverId.toString()
            : msg.senderId.toString()
        )
      ),
    ];

    const partners = await User.find({ _id: { $in: partnerIds } }).select("-password");
    res.status(200).json(partners);
  } catch (err) {
    console.error("getChatPartners error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ─── Messages ──────────────────────────────────────────────────────────────

export const getMessagesByUserId = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: partnerId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: partnerId },
        { senderId: partnerId, receiverId: myId },
      ],
    });

    // mark unseen messages as read
    const unread = messages.filter(
      (m) => m.receiverId.toString() === myId.toString() && !m.readAt
    );
    if (unread.length > 0) {
      const unreadIds = unread.map((m) => m._id);
      await Message.updateMany({ _id: { $in: unreadIds } }, { readAt: new Date() });
    }

    res.status(200).json(messages);
  } catch (err) {
    console.error("getMessagesByUserId error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    if (!text && !image) {
      return res.status(400).json({ message: "Message must have text or an image." });
    }
    if (senderId.equals(receiverId)) {
      return res.status(400).json({ message: "Cannot send a message to yourself." });
    }

    const receiverExists = await User.exists({ _id: receiverId });
    if (!receiverExists) {
      return res.status(404).json({ message: "Recipient not found." });
    }

    let imageUrl;
    if (image) {
      if (!cloudinaryConfigured()) return res.status(503).json({ message: "Image uploads not configured." });
    const upload = await cloudinary.uploader.upload(image);
      imageUrl = upload.secure_url;
    }

    const message = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    // real-time delivery
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", message);
    }

    res.status(201).json(message);
  } catch (err) {
    console.error("sendMessage error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ─── Delete Message (soft delete) ─────────────────────────────────────────

export const deleteMessage = async (req, res) => {
  try {
    const { id: messageId } = req.params;
    const userId = req.user._id;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found." });
    }

    // only sender can delete their own message
    if (message.senderId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "You can only delete your own messages." });
    }

    message.deletedAt = new Date();
    message.text = null;
    message.image = null;
    await message.save();

    // notify the receiver about the deletion in real time
    const receiverSocketId = getReceiverSocketId(message.receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("messageDeleted", { messageId: message._id });
    }

    res.status(200).json({ message: "Message deleted.", messageId: message._id });
  } catch (err) {
    console.error("deleteMessage error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ─── React to a Message ────────────────────────────────────────────────────

export const reactToMessage = async (req, res) => {
  try {
    const { id: messageId } = req.params;
    const { emoji } = req.body;
    const userId = req.user._id;

    if (!emoji) {
      return res.status(400).json({ message: "Emoji is required." });
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found." });
    }
    if (message.deletedAt) {
      return res.status(400).json({ message: "Cannot react to a deleted message." });
    }

    // toggle: if same emoji already exists from this user, remove it
    const existingIdx = message.reactions.findIndex(
      (r) => r.userId.toString() === userId.toString() && r.emoji === emoji
    );

    if (existingIdx !== -1) {
      message.reactions.splice(existingIdx, 1);
    } else {
      // replace any previous reaction from this user with the new emoji
      const previousIdx = message.reactions.findIndex(
        (r) => r.userId.toString() === userId.toString()
      );
      if (previousIdx !== -1) message.reactions.splice(previousIdx, 1);
      message.reactions.push({ emoji, userId });
    }

    await message.save();

    // notify both participants
    const receiverSocketId = getReceiverSocketId(message.receiverId);
    const senderSocketId = getReceiverSocketId(message.senderId);

    const payload = { messageId: message._id, reactions: message.reactions };
    if (receiverSocketId) io.to(receiverSocketId).emit("reactionUpdated", payload);
    if (senderSocketId) io.to(senderSocketId).emit("reactionUpdated", payload);

    res.status(200).json(message);
  } catch (err) {
    console.error("reactToMessage error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ─── Unread Count ──────────────────────────────────────────────────────────

export const getUnreadCounts = async (req, res) => {
  try {
    const myId = req.user._id;

    // group unread messages by senderId
    const unread = await Message.aggregate([
      {
        $match: {
          receiverId: myId,
          readAt: null,
          deletedAt: null,
        },
      },
      {
        $group: {
          _id: "$senderId",
          count: { $sum: 1 },
        },
      },
    ]);

    // convert to { senderId: count } map for easy frontend lookup
    const countsMap = {};
    unread.forEach((entry) => {
      countsMap[entry._id.toString()] = entry.count;
    });

    res.status(200).json(countsMap);
  } catch (err) {
    console.error("getUnreadCounts error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
