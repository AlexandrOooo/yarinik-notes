import React from 'react'
import { Modal, Form, Button } from 'react-bootstrap'
import { Note } from '../Model/notes'
import { useForm } from 'react-hook-form'
import axios from 'axios'

interface AddNoteDialogProps {
  onDismiss: () => void
  onNoteSaved: (note: Note) => void
}

interface NoteBody {
  title: string
  text: string
}
export const AddNoteDialog: React.FC<AddNoteDialogProps> = ({
  onDismiss,
  onNoteSaved
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<NoteBody>()

  async function onSubmit(input: NoteBody) {
    try {
      const { data } = await axios.post('/api/notes', input, {
        headers: { 'Content-Type': 'application/json' }
      })
      onNoteSaved(data)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <Modal show onHide={onDismiss} onSubmit={handleSubmit(onSubmit)}>
      <Modal.Header closeButton>
        <Modal.Title>Add Note</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form id="addNoteForm">
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter title"
              isInvalid={Boolean(errors.title)}
              {...register('title', { required: 'Required' })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.title?.message}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Text</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              placeholder="Enter text"
              {...register('title')}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button type="submit" form="addNoteForm" disabled={isSubmitting}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
