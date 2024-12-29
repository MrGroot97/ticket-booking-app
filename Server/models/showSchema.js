import mongoose from 'mongoose'

const showSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
        required: true
    },
    theatre: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Theatre',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    totalSeats: {
        type: Number,
        required: true
    },
    bookedSeats: {
        type: Array,
        default: []
    },
    isActive: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const Show = mongoose.model('Show', showSchema)

export default Show
