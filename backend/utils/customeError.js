export class CustomError extends Error {
  constructor(msg, statusCode) {
    super(msg);
    this.message = msg || "SOMETHING WENT WRONG";
    this.statusCode = statusCode || 500;
    Error.captureStackTrace(this, CustomError);
  }
}
