import mongoose from 'mongoose'

const movieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    language: {
        // convert into array of strings
        type: [String],
        required: true
    },
    genre: {
        type: [String],
        required: true
    },
    releaseDate: {
        type: Date,
        required: true
    },
    poster: {
        type: String,
        required: true
    }
})

const Movie = mongoose.model('Movie', movieSchema)

export default Movie