import express, { NextFunction, Request, Response, application } from 'express'
import notesRouter from './routes/notes'
import morgan from 'morgan'
import createHttpError, { isHttpError } from 'http-errors'

const app = express()
app.use(morgan('dev'))
app.use(express.json())

app.use('/api/notes', notesRouter)
app.use((req, res, next) => {
  next(createHttpError(404, 'Route Not found'))
})

app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(error)

  let errorMessage = 'Internal server error'
  let statusCode = 500
  if (isHttpError(error)) {
    statusCode = error.status
    errorMessage = error.message
  }

  res.status(statusCode).json({ message: errorMessage })
})
export default app
