import { HttpStatusCode } from "@/constants/HttpStatusCode";
import { MESSAGE } from "@/lib/message";
import { ApiError } from "@/wrapper/api-error/ApiError";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "@/model/User";

export class AuthService {
  static async signUp({ email, password, name }) {
    const user = await User.findOne({ email });

    if (user) {
      throw new ApiError(
        MESSAGE.API.ERROR.USER_ALREADY_EXIST,
        HttpStatusCode.CONFLICT
      );
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    await User.create({
      email,
      password: hashedPassword,
      name,
    });

    return null;
  }

  static async logIn({ email, password }) {
    const user = await User.findOne({ email });

    if (!user) {
      throw new ApiError(
        MESSAGE.API.ERROR.ACCOUNT_NOT_FOUND,
        HttpStatusCode.NOT_FOUND
      );
    }

    const isValid = await bcryptjs.compare(password, user.password);

    if (!isValid) {
      throw new ApiError(
        MESSAGE.API.ERROR.WRONG_CREDENTIALS,
        HttpStatusCode.BAD_REQUEST
      );
    }

    const payload = {
      id: user?._id.toString(),
      email: user?.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    return {
      data: null,
      token,
    };
  }
}
