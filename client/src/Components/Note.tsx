import React from 'react'
import { NoteProps } from './types'
import { Card } from 'react-bootstrap'
import { formatDate } from '../utils/formatDate'
import styles from './Note.module.css'
import { MdDelete } from 'react-icons/md'
import styleUtils from '../styles/utils.module.css'

const Note: React.FC<NoteProps> = ({
  note,
  className,
  onDeleteNoteClick,
  onNoteClick
}) => {
  const { title, text, createdAt, updatedAt } = note
  let noteTime: string
  if (createdAt < updatedAt) {
    noteTime = 'Updated: ' + formatDate(updatedAt)
  } else {
    noteTime = 'Created: ' + formatDate(createdAt)
  }
  return (
    <Card className={`${styles.noteCard} ${className}`} onClick={onNoteClick}>
      <Card.Body className={styles.cardBody}>
        <Card.Title className={styleUtils.flexCenter}>
          {title}
          <MdDelete
            className="text-muted ms-auto"
            onClick={() => onDeleteNoteClick(note._id)}
          />
        </Card.Title>
        <Card.Text className={styles.cardText}>{text}</Card.Text>
      </Card.Body>
      <Card.Footer className="text-muted">{noteTime}</Card.Footer>
    </Card>
  )
}
export default Note
