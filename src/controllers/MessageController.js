import { MessageService } from "@/services/MessageService";
import { ApiError } from "@/wrapper/api-error/ApiError";
import { HttpStatusCode } from "@/constants/HttpStatusCode";

export class MessageController {
  static async createMessage(user, recipientId, messageText) {
    if (!user) {
      throw new ApiError("Unauthorized", HttpStatusCode.UNAUTHORIZED);
    }

    if (!recipientId || !messageText) {
      throw new ApiError(
        "Recipient ID and message are required",
        HttpStatusCode.BAD_REQUEST
      );
    }

    if (!messageText.trim()) {
      throw new ApiError("Message cannot be empty", HttpStatusCode.BAD_REQUEST);
    }

    return MessageService.createMessage(user.id, recipientId, messageText);
  }

  static async getMessagesBetweenUsers(user, partnerId) {
    if (!user) {
      throw new ApiError("Unauthorized", HttpStatusCode.UNAUTHORIZED);
    }

    if (!partnerId) {
      throw new ApiError("Partner ID is required", HttpStatusCode.BAD_REQUEST);
    }

    return MessageService.getMessagesBetweenUsers(user.id, partnerId);
  }
}
