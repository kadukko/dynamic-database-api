class RequestError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);

    this.name = 'RequestError';
    this.statusCode = statusCode;
  }
}

export default RequestError;
