import { useEffect, useState } from 'react'
import axios from 'axios'
import Note from './Components/Note'
import { Note as NoteModel } from './Model/notes'
import { Container, Row, Col, Button, Spinner } from 'react-bootstrap'
import styles from './App.module.css'
import { AddEditNoteDialog } from './Components/AddEditNoteDialog'
import { FaPlus } from 'react-icons/fa'
import styleUtils from './styles/utils.module.css'

function App() {
  const [notes, setNotes] = useState<NoteModel[]>([])
  const [showAddNoteDialog, setShowAddNoteDialog] = useState(false)
  const [noteToEdit, setNoteToEdit] = useState<NoteModel | null>(null)
  const [notesLoading, setNotesLoading] = useState(false)
  const [showNotesLoadingError, setShowNotesLoadingError] = useState(false)

  useEffect(() => {
    const loadNotes = async () => {
      try {
        setNotesLoading(true)
        const { data } = await axios.get('/api/notes')
        setNotes(data)
      } catch (error) {
        setShowNotesLoadingError(true)
        console.log(error)
      } finally {
        setNotesLoading(false)
      }
    }
    loadNotes()
  }, [])

  const onDeleteNoteClick = async (noteId: string) => {
    try {
      await axios.delete(`/api/notes/${noteId}`)
      setNotes(notes.filter((note) => note._id !== noteId))
    } catch (error) {
      console.log(error)
    }
  }

  const NoteRow = (
    <Row xs={1} md={2} xl={3} className="g-4">
      {notes.map((note) => (
        <Col key={note._id}>
          <Note
            note={note}
            className={styles.note}
            onDeleteNoteClick={onDeleteNoteClick}
            onNoteClick={() => setNoteToEdit(note)}
          />
        </Col>
      ))}
    </Row>
  )

  return (
    <Container>
      <Button
        onClick={() => setShowAddNoteDialog(true)}
        className={`mb-4 ${styleUtils.flexCenter}`}>
        <FaPlus />
        Add New Note
      </Button>
      {notesLoading && <Spinner animation="border" variant="primary" />}
      {showNotesLoadingError && (
        <p>Something went wrong. Please try to reload page</p>
      )}
      {!notesLoading && !showNotesLoadingError && NoteRow}
      {showAddNoteDialog && (
        <AddEditNoteDialog
          onDismiss={() => setShowAddNoteDialog(false)}
          onNoteSaved={(newNote) => {
            setNotes([...notes, newNote])
            window.location.reload()
          }}
        />
      )}
      {noteToEdit && (
        <AddEditNoteDialog
          onDismiss={() => setNoteToEdit(null)}
          onNoteSaved={(updatedNote) => {
            setNotes(
              notes.map((note) =>
                updatedNote._id === note._id ? updatedNote : note
              )
            )
            setNoteToEdit(null)
            window.location.reload()
          }}
          noteToEdit={noteToEdit}
        />
      )}
    </Container>
  )
}

export default App
