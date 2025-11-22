import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import { connectRedis } from "@/config/redis";
import { HttpStatusCode } from "@/constants/HttpStatusCode";
import { ApiError } from "../api-error/ApiError";

export const apiHandler = (handler) => {
  return async (req, context) => {
    try {
      await connectDB();
      await connectRedis();

      const result = await handler(req, context);

      const status = result?.status || HttpStatusCode.OK;

      const response = NextResponse.json(
        {
          status,
          data: result.data || null,
          message: result.message,
        },
        { status }
      );

      // New flexible cookie handling
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
