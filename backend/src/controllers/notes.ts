import { RequestHandler } from 'express'
import NoteModel from '../models/note'
import createHttpError from 'http-errors'
import mongoose from 'mongoose'

export const getNotes: RequestHandler = async (req, res, next) => {
  try {
    const notes = await NoteModel.find().exec()
    res.status(200).json(notes)
  } catch (error) {
    next(error)
  }
}

export const getNote: RequestHandler = async (req, res, next) => {
  const noteId = req.params.noteId
  try {
    if (!mongoose.isValidObjectId(noteId)) {
      throw createHttpError(400, 'Invalid noteId')
    }
    const note = await NoteModel.findById(noteId).exec()

    if (!note) {
      throw createHttpError(404, 'Note not found')
    }
    res.status(200).json(note)
  } catch (error) {
    next(error)
  }
}

interface NoteBody {
  title?: string
  text: string
}
export const createNote: RequestHandler<
  unknown,
  unknown,
  NoteBody,
  unknown
> = async (req, res, next) => {
  const { title, text } = req.body
  try {
    if (!title) {
      throw createHttpError(400, 'Title is required')
    }
    const newNote = await NoteModel.create({ title, text })
    res.status(201).json(newNote)
  } catch (error) {
    next(error)
  }
}
interface NoteParams {
  noteId: string
}
export const updateNote: RequestHandler<
  NoteParams,
  unknown,
  NoteBody,
  unknown
> = async (req, res, next) => {
  const noteId = req.params.noteId
  const { title, text } = req.body
  try {
    if (!mongoose.isValidObjectId(noteId)) {
      throw createHttpError(400, 'Invalid noteId')
    }

    if (!title) {
      throw createHttpError(400, 'Title is required')
    }

    const note = await NoteModel.findById(noteId).exec()

    if (!note) {
      throw createHttpError(404, 'Note not found')
    }
    note.title = title
    note.text = text

    const updatedNote = await note.save()
    res.status(200).json(updatedNote)
  } catch (error) {
    next(error)
  }
}
export const deleteNote: RequestHandler<
  NoteParams,
  unknown,
  NoteBody,
  unknown
> = async (req, res, next) => {
  const noteId = req.params.noteId
  try {
    if (!mongoose.isValidObjectId(noteId)) {
      throw createHttpError(400, 'Invalid noteId')
    }

    const note = await NoteModel.findByIdAndDelete(noteId).exec()

    // if (!note) {
    //   throw createHttpError(404, 'Note not found')
    // }
    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
}
