import { User } from "@/model/User";

export class UserService {
  static async getAllUsers(userId) {
    const users = await User.find(
      { _id: { $ne: userId } },
      { password: 0 }
    ).sort({ createdAt: -1 });

    return users;
  }
}
