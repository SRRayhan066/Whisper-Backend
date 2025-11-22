import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { MESSAGE } from "./lib/message";

export function middleware(request) {
  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return NextResponse.json(
      { error: MESSAGE.API.ERROR.NO_TOKEN },
      { status: 401 }
    );
  }

  try {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    return NextResponse.next();
  } catch (error) {
    return NextResponse.json(
      { error: MESSAGE.API.TOKEN_EXPIRED },
      { status: 401 }
    );
  }
}

export const config = {
  matcher: "/api/protected/:path*",
};
