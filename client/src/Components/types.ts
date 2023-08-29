import { Note as NoteModel } from '../Model/notes'
export interface NoteProps {
  note: NoteModel
  className?: string
  onDeleteNoteClick: (noteId: string) => void
  onNoteClick: () => void
}
