import { AuthService } from "@/services/AuthService";
import { cookies } from "next/headers";
import { ApiError } from "@/wrapper/api-error/ApiError";
import { HttpStatusCode } from "@/constants/HttpStatusCode";
import { MESSAGE } from "@/lib/message";

export class AuthController {
  static async signUp({ email, password, name }) {
    return AuthService.signUp({ email, password, name });
  }

  static async logIn({ email, password }) {
    return AuthService.logIn({ email, password });
  }

  static async reissueAccessToken() {
    const cookieStore = cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!refreshToken) {
      throw new ApiError(
        MESSAGE.API.ERROR.REFRESH_TOKEN_NOT_FOUND,
        HttpStatusCode.UNAUTHORIZED
      );
    }

    return AuthService.reissueAccessToken(refreshToken);
  }

  static async signOut() {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (refreshToken) {
      await AuthService.deleteRefreshToken(refreshToken);
    }
  }
}
