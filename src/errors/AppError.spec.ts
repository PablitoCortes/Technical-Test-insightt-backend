import { AppError } from "./AppError";

describe("AppError", () => {
  it("should create an instance with message and statusCode", () => {
    const message = "Test Error";
    const statusCode = 400;
    const error = new AppError(message, statusCode);

    expect(error).toBeInstanceOf(AppError);
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe(message);
    expect(error.statusCode).toBe(statusCode);
  });

  it("should maintain prototype link", () => {
    const error = new AppError("Message", 500);
    expect(Object.getPrototypeOf(error)).toBe(AppError.prototype);
  });
});
