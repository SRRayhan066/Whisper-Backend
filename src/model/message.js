import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      required: true,
    },
    recipientId: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

MessageSchema.index({ senderId: 1, recipientId: 1 });
MessageSchema.index({ createdAt: -1 });

export const Message =
  mongoose.models.messages || mongoose.model("messages", MessageSchema);
