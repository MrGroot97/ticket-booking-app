import mongoose from 'mongoose'

const bookingSchema = new mongoose.Schema({
    show: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Show',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    seats: {
        type: Array,
        required: true
    },
    transactionId: {
        type: String,
        required: true
    },
}, { timestamps: true })

const Booking = mongoose.model('Booking', bookingSchema)
export default Booking