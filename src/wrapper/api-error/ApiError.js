import { HttpStatusCode } from "@/constants/HttpStatusCode";

export class ApiError extends Error {
  constructor(message, statusCode = HttpStatusCode.INTERNAL_SERVER_ERROR) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ApiError";
  }
}
