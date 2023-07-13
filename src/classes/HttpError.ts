class HttpError extends Error {
  statusCode: number

  constructor (message: string, statusCode = 500) {
    super(message)

    this.name = 'HttpError'
    this.statusCode = statusCode
  }
}

export default HttpError