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
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!decoded.userId || !decoded.email) {
      return NextResponse.json(
        { error: MESSAGE.API.ERROR.INVALID_TOKEN },
        { status: 401 }
      );
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.json(
      { error: MESSAGE.API.ERROR.TOKEN_EXPIRED },
      { status: 401 }
    );
  }
}

export const config = {
  matcher: "/api/(protected)/:path*",
};
