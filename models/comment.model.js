import mongoose from 'mongoose'
const commentSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    content: {
        type: String,
        required: true
    }
})

export const Comment = mongoose.model("Comment",commentSchema)