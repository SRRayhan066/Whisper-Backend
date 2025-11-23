import { apiHandler } from "@/wrapper/api-handler/ApiHandler";
import { AuthController } from "@/controllers/AuthController";
import { HttpStatusCode } from "@/constants/HttpStatusCode";
import { MESSAGE } from "@/lib/message";

export const POST = apiHandler(async () => {
  await AuthController.signOut();

  return {
    status: HttpStatusCode.OK,
    message: MESSAGE.API.LOGOUT_SUCCESS,
    cookies: [
      {
        name: "refreshToken",
        value: "",
        options: {
          httpOnly: true,
          path: "/",
          maxAge: 0,
        },
      },
    ],
  };
});
