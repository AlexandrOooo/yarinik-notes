import express, { NextFunction, Request, Response, application } from 'express'
import notesRouter from './routes/notes'
import morgan from 'morgan'
import createHttpError, { isHttpError } from 'http-errors'
import userRouter from './routes/users'
import session from 'express-session'
import env from './util/validateEnv'
import MongoStore from 'connect-mongo'

const app = express()
app.use(morgan('dev'))
app.use(express.json())

app.use(
  session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60
    },
    rolling: true,
    store: MongoStore.create({
      mongoUrl: env.MONGO_CONNECTION
    })
  })
)
app.use('/api/notes', notesRouter)
app.use('/api/auth', userRouter)
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
