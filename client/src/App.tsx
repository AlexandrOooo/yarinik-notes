import { useEffect, useState } from 'react'
import axios from 'axios'
import Note from './Components/Note'
import { Note as NoteModel } from './Model/notes'
import { Container, Row, Col, Button } from 'react-bootstrap'
import styles from './App.module.css'
import { AddNoteDialog } from './Components/AddNoteDialog'

function App() {
  const [notes, setNotes] = useState<NoteModel[]>([])
  const [showAddNoteDialog, setShowAddNoteDialog] = useState(false)
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
  return (
    <Container>
      <Button onClick={() => setShowAddNoteDialog(true)} className="mb-4">
        Add Note
      </Button>
      <Row xs={1} md={2} xl={3} className="g-4">
        {notes.map((note) => (
          <Col key={note._id}>
            <Note note={note} className={styles.note} />
          </Col>
        ))}
      </Row>
      {showAddNoteDialog && (
        <AddNoteDialog
          onDismiss={() => setShowAddNoteDialog(false)}
          onNoteSaved={(newNote) => {
            setNotes([...notes, newNote])
            window.location.reload()
          }}
        />
      )}
    </Container>
  )
}

export default App
