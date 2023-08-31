import { Schema, InferSchemaType, model } from 'mongoose'
const userSchema = new Schema(
  {
    password: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true }
  },
  { timestamps: true }
)
type User = InferSchemaType<typeof userSchema>

export default model<User>('Note', userSchema)
