import express, { NextFunction, Request, Response } from "express"
import helmet from 'helmet'
import cors from 'cors'
import routes from './routes'
import RequestError from "./classes/RequestError"

const server = express()

server.use(helmet())
server.use(cors({ origin: '*' }))
server.use(express.json())
server.use(express.urlencoded({extended: true}))

server.use(routes)

server.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err)

  if (res.headersSent) return next(err)

  let statusCode = 500

  if (err instanceof RequestError) {
    statusCode = err.statusCode
  }

  res.status(statusCode).send(err.message)
})

export default server