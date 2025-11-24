import { apiHandler } from "@/wrapper/api-handler/ApiHandler";
import { MessageController } from "@/controllers/MessageController";
import { HttpStatusCode } from "@/constants/HttpStatusCode";

export const POST = apiHandler(async ({ req, user }) => {
  const body = await req.json();
  const { recipientId, message } = body;

  const newMessage = await MessageController.createMessage(
    user,
    recipientId,
    message
  );

  return {
    data: newMessage,
    status: HttpStatusCode.CREATED,
    message: "Message sent successfully",
  };
});

export const GET = apiHandler(async ({ req, user }) => {
  const { searchParams } = new URL(req.url);
  const partnerId = searchParams.get("id");

  const messages = await MessageController.getMessagesBetweenUsers(
    user,
    partnerId
  );

  return {
    data: messages,
    status: HttpStatusCode.OK,
    message: "Messages retrieved successfully",
  };
});
