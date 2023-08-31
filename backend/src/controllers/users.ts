import { RequestHandler } from 'express'
import createHttpError from 'http-errors'
import UserModel from '../models/user'
import bcrypt from 'bcrypt'

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
  const userId = req.session.userId

  try {
    if (!userId) {
      throw createHttpError(401, 'Not authenticated')
    }

    const user = await UserModel.findById(userId).select('+email').exec()
  } catch (error) {
    next(error)
  }
}

export const logout: RequestHandler = async (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      next(error)
    }
    res.status(204).end()
  })
}

interface SignUpBody {
  email: string
  password: string
  name: string
}
export const signUp: RequestHandler<
  unknown,
  unknown,
  Partial<SignUpBody>,
  unknown
> = async (req, res, next) => {
  const { email, password, name } = req.body
  try {
    if (!email || !password || !name) {
      throw createHttpError(400, 'Missing email, password or name')
    }
    const findUserByName = await UserModel.findOne({ name }).exec()

    if (findUserByName) {
      throw createHttpError(409, 'Name already exists')
    }
    const findUserByEmail = await UserModel.findOne({ email }).exec()

    if (findUserByEmail) {
      throw createHttpError(409, 'Email already exists')
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await UserModel.create({ email, password: passwordHash, name })

    req.session.userId = user._id
    res.status(201).json(user)
  } catch (error) {
    next(error)
  }
}

interface LoginBody {
  name: string
  password: string
}
export const login: RequestHandler<
  unknown,
  unknown,
  Partial<LoginBody>,
  unknown
> = async (req, res, next) => {
  const { name, password } = req.body
  try {
    if (!name || !password) {
      throw createHttpError(400, 'Missing name or password')
    }

    const user = await UserModel.findOne({ name })
      .select('+password +email')
      .exec()

    if (!user) {
      throw createHttpError(401, 'Invalid credentials')
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw createHttpError(401, 'Invalid credentials')
    }

    req.session.userId = user._id

    res.status(201).json(user)
  } catch (error) {
    next(error)
  }
}
