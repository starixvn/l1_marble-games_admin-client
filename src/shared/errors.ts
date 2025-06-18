export class ApiError extends Error {
}

export class UnauthorizedError extends ApiError {
  constructor(message: string) {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

