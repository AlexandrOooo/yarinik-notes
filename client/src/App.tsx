import { useEffect, useState } from 'react'
import axios from 'axios'
import Note from './Components/Note'
import { Note as NoteModel } from './Model/notes'
import { Container, Row, Col } from 'react-bootstrap'
import styles from './App.module.css'

function App() {
  const [notes, setNotes] = useState<NoteModel[]>([])
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
      <Row xs={1} md={2} xl={3} className="g-4">
        {notes.map((note) => (
          <Col key={note._id}>
            <Note note={note} className={styles.note} />
          </Col>
        ))}
      </Row>
    </Container>
  )
}

export default App
