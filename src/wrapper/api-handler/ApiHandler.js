import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import { HttpStatusCode } from "@/constants/HttpStatusCode";
import { ApiError } from "../api-error/ApiError";

export const apiHandler = (handler) => {
  return async (req, context) => {
    try {
      await connectDB();

      const result = await handler(req, context);

      const status = result?.status || HttpStatusCode.OK;

      const response = NextResponse.json(
        {
          status,
          data: result.data || result,
          message: result.message,
        },
        { status }
      );

      if ("token" in result) {
        response.cookies.set({
          name: "auth_token",
          value: result.token,
          httpOnly: true,
          maxAge: result.token === "" ? 0 : undefined,
          path: "/",
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
