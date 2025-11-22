import { apiHandler } from "@/wrapper/api-handler/ApiHandler";
import { AuthController } from "@/controllers/AuthController";
import { MESSAGE } from "@/lib/message";
import { HttpStatusCode } from "@/constants/HttpStatusCode";

export const GET = apiHandler(async () => {
  const { accessToken } = await AuthController.reissueAccessToken();

  return {
    data: { accessToken },
    status: HttpStatusCode.OK,
    message: MESSAGE.API.ACCESS_TOKEN_REFRESHED,
  };
});
