import { Message } from "@/model/message";

export class MessageService {
  static async createMessage(senderId, recipientId, messageText) {
    const message = await Message.create({
      senderId,
      recipientId,
      message: messageText,
    });

    return message;
  }

  static async getMessagesBetweenUsers(userId, partnerId) {
    const messages = await Message.find({
      $or: [
        { senderId: userId, recipientId: partnerId },
        { senderId: partnerId, recipientId: userId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("senderId", "name email")
      .populate("recipientId", "name email");

    return messages;
  }
}
