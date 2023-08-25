import React from 'react'
import { NoteProps } from './types'
import { Card } from 'react-bootstrap'
import { formatDate } from '../utils/formatDate'
import styles from './Note.module.css'

const Note: React.FC<NoteProps> = ({ note, className }) => {
  const { title, text, createdAt, updatedAt } = note
  let noteTime: string
  if (createdAt < updatedAt) {
    noteTime = 'Updated: ' + formatDate(updatedAt)
  } else {
    noteTime = 'Created: ' + formatDate(createdAt)
  }
  return (
    <Card className={`${styles.noteCard} ${className}`}>
      <Card.Body className={styles.cardBody}>
        <Card.Title>{title}</Card.Title>
        <Card.Text className={styles.cardText}>{text}</Card.Text>
      </Card.Body>
      <Card.Footer className="text-muted">{noteTime}</Card.Footer>
    </Card>
  )
}
export default Note
