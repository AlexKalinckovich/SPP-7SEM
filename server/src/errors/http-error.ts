import { StatusCodes } from "http-status-codes";

export class HttpError extends Error {
  constructor(
    readonly status: number = StatusCodes.INTERNAL_SERVER_ERROR,
    message: string,
    readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

/** 400 Bad Request */
export const badRequest = (
  message: string,
  details?: Record<string, unknown>,
): HttpError => new HttpError(StatusCodes.BAD_REQUEST, message, details);

/** 404 Not Found */
export const notFound = (message: string): HttpError =>
  new HttpError(StatusCodes.NOT_FOUND, message);

/** 409 Conflict */
export const conflict = (message: string): HttpError =>
  new HttpError(StatusCodes.CONFLICT, message);