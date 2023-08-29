import React from 'react'
import { Modal, Form, Button } from 'react-bootstrap'
import { Note } from '../Model/notes'
import { useForm } from 'react-hook-form'
import axios from 'axios'

interface AddEditNoteDialogProps {
  onDismiss: () => void
  onNoteSaved: (note: Note) => void
  noteToEdit?: Note
}

interface NoteBody {
  title: string
  text: string
}
export const AddEditNoteDialog: React.FC<AddEditNoteDialogProps> = ({
  noteToEdit,
  onDismiss,
  onNoteSaved
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<NoteBody>({
    defaultValues: {
      title: noteToEdit?.title || '',
      text: noteToEdit?.text || ''
    }
  })

  async function onSubmit(input: NoteBody) {
    try {
      let noteResponse
      if (noteToEdit) {
        noteResponse = await axios.put(`/api/notes/${noteToEdit._id}`, input, {
          headers: { 'Content-Type': 'application/json' }
        })
      } else {
        noteResponse = await axios.post('/api/notes', input, {
          headers: { 'Content-Type': 'application/json' }
        })
      }
      onNoteSaved(noteResponse.data)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <Modal show onHide={onDismiss} onSubmit={handleSubmit(onSubmit)}>
      <Modal.Header closeButton>
        <Modal.Title>{noteToEdit ? 'Edit Note' : 'Add Note'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form id="addEditNoteForm">
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
              {...register('text')}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button type="submit" form="addEditNoteForm" disabled={isSubmitting}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
