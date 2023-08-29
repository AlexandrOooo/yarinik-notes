import { useEffect, useState } from 'react'
import axios from 'axios'
import Note from './Components/Note'
import { Note as NoteModel } from './Model/notes'
import { Container, Row, Col, Button } from 'react-bootstrap'
import styles from './App.module.css'
import { AddEditNoteDialog } from './Components/AddEditNoteDialog'
import { FaPlus } from 'react-icons/fa'
import styleUtils from './styles/utils.module.css'

function App() {
  const [notes, setNotes] = useState<NoteModel[]>([])
  const [showAddNoteDialog, setShowAddNoteDialog] = useState(false)
  const [noteToEdit, setNoteToEdit] = useState<NoteModel | null>(null)

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const { data } = await axios.get('/api/notes')
        setNotes(data)
      } catch (error) {
        console.log(error)
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
  return (
    <Container>
      <Button
        onClick={() => setShowAddNoteDialog(true)}
        className={`mb-4 ${styleUtils.flexCenter}`}>
        <FaPlus />
        Add New Note
      </Button>
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
