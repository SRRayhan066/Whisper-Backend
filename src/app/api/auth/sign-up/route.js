import { apiHandler } from "@/wrapper/api-handler/ApiHandler";
import { AuthController } from "@/controllers/AuthController";
import { HttpStatusCode } from "@/constants/HttpStatusCode";
import { MESSAGE } from "@/lib/message";

export const POST = apiHandler(async (req) => {
  const reqBody = await req.json();
  const result = await AuthController.signUp(reqBody);
  return {
    data: result,
    status: HttpStatusCode.OK,
    message: MESSAGE.API.USER_CREATED,
  };
});
