import express, { NextFunction, Request, Response, application } from 'express'
import notesRouter from './routes/notes'

const app = express()
app.use(express.json())

app.use('/api/notes', notesRouter)
app.use((req, res, next) => {
  next(new Error('Route Not found'))
})

app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(error)
  res.status(500).json({ message: 'Internal server error' })
})
export default app
