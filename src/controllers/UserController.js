import { UserService } from "@/services/UserService";
import { ApiError } from "@/wrapper/api-error/ApiError";
import { HttpStatusCode } from "@/constants/HttpStatusCode";

export class UserController {
  static async getAllUsers(user) {
    if (!user) {
      throw new ApiError("Unauthorized", HttpStatusCode.UNAUTHORIZED);
    }

    return UserService.getAllUsers(user.id);
  }
}
