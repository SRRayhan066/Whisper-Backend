import { HttpStatusCode } from "@/constants/HttpStatusCode";
import { MESSAGE } from "@/lib/message";
import { ApiError } from "@/wrapper/api-error/ApiError";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "@/model/User";
import { v4 as uuidv4 } from "uuid";
import { redisClient } from "@/config/redis";
import {
  ACCESS_TOKEN_EXPIRATION,
  REFRESH_TOKEN_EXPIRATION_SECONDS,
} from "@/constants/ApplicationConstant";

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

  static #generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRATION,
    });
    const refreshToken = uuidv4();
    return { accessToken, refreshToken };
  }

  static async #storeRefreshToken(token, userId) {
    await redisClient.set(token, userId.toString(), {
      EX: REFRESH_TOKEN_EXPIRATION_SECONDS,
    });
  }

  static async logIn({ email, password }) {
    const user = await User.findOne({ email });

    if (!user) {
      throw new ApiError(
        MESSAGE.API.ERROR.USER_NOT_FOUND,
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
      id: user._id.toString(),
      email: user.email,
    };

    const { accessToken, refreshToken } = this.#generateTokens(payload);
    await this.#storeRefreshToken(refreshToken, user._id);

    return {
      accessToken,
      refreshToken,
    };
  }

  static async deleteRefreshToken(token) {
    await redisClient.del(token);
  }

  static async reissueAccessToken(token) {
    const userId = await redisClient.get(token);
    if (!userId) {
      throw new ApiError(
        MESSAGE.API.ERROR.INVALID_REFRESH_TOKEN,
        HttpStatusCode.UNAUTHORIZED
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(
        MESSAGE.API.ERROR.USER_NOT_FOUND,
        HttpStatusCode.NOT_FOUND
      );
    }

    const payload = {
      id: user._id.toString(),
      email: user.email,
    };

    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRATION,
    });

    return { accessToken };
  }
}
