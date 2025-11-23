import { apiHandler } from "@/wrapper/api-handler/ApiHandler";
import { AuthController } from "@/controllers/AuthController";
import { HttpStatusCode } from "@/constants/HttpStatusCode";
import { MESSAGE } from "@/lib/message";
import { REFRESH_TOKEN_EXPIRATION_SECONDS } from "@/constants/ApplicationConstant";

export const POST = apiHandler(async ({ req }) => {
  const reqBody = await req.json();
  const { accessToken, refreshToken } = await AuthController.logIn(reqBody);

  return {
    data: { accessToken },
    status: HttpStatusCode.OK,
    message: MESSAGE.API.LOGIN_SUCCESS,
    cookies: [
      {
        name: "refreshToken",
        value: refreshToken,
        options: {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          path: "/",
          maxAge: parseInt(REFRESH_TOKEN_EXPIRATION_SECONDS || "604800"),
        },
      },
    ],
  };
});
