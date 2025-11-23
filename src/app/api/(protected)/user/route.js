import { apiHandler } from "@/wrapper/api-handler/ApiHandler";
import { UserController } from "@/controllers/UserController";
import { HttpStatusCode } from "@/constants/HttpStatusCode";

export const GET = apiHandler(async ({ user }) => {
  const users = await UserController.getAllUsers(user);

  return {
    data: users,
    status: HttpStatusCode.OK,
    message: "Users retrieved successfully",
  };
});
