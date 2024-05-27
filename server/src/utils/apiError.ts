export class ApiError extends Error {
  public status: number;
  public constructor(message = "error in api", status = 400) {
    super(message);
    this.message = message;
    this.status = status;
  }
}
