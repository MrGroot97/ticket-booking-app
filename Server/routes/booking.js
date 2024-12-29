import express from 'express'
import { makePayment, bookShow, getAllBookings, makePaymentAndBookShow } from '../controllers/booking.js'

const router = express.Router()

router.post('/makePayment', makePayment)
router.post('/bookShow', bookShow)
router.post('/getAllBookings', getAllBookings)
router.post('/makePaymentAndBookShow', makePaymentAndBookShow)

export default router