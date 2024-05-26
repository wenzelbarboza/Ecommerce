export class ApiError extends Error {
  private status: number;
  public constructor(message = "error in api", status = 400) {
    super(message);
    this.message = message;
    this.status = status;
  }
}
