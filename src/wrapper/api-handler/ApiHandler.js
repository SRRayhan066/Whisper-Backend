import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import { connectRedis } from "@/config/redis";
import { HttpStatusCode } from "@/constants/HttpStatusCode";
import { ApiError } from "../api-error/ApiError";
import jwt from "jsonwebtoken";

export const apiHandler = (handler) => {
  return async (req, context) => {
    try {
      await connectDB();
      await connectRedis();

      let user = null;

      const authHeader = req.headers.get("Authorization");
      const token = authHeader?.split(" ")[1];

      if (token) {
        try {
          const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

          if (decoded.id && decoded.email) {
            user = {
              id: decoded.id,
              email: decoded.email,
            };
          }
        } catch (error) {
          user = null;
        }
      }

      const result = await handler({ req, context, user });

      const status = result?.status || HttpStatusCode.OK;

      const response = NextResponse.json(
        {
          status,
          data: result.data || null,
          message: result.message,
        },
        { status }
      );

      if (Array.isArray(result.cookies)) {
        result.cookies.forEach((cookie) => {
          response.cookies.set(cookie.name, cookie.value, cookie.options);
        });
      }

      return response;
    } catch (error) {
      const statusCode =
        error instanceof ApiError
          ? error.statusCode
          : HttpStatusCode.INTERNAL_SERVER_ERROR;

      return NextResponse.json(
        {
          status: statusCode,
          error: error.message,
        },
        { status: statusCode }
      );
    }
  };
};
