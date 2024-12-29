import axiosInstance from './index'

const getAllBookings = async (userId) => {
    const response = await axiosInstance.post('/booking/getAllBookings', { userId })
    return response.data
}

const bookShow = async (showId, seats, transactionId) => {
    const response = await axiosInstance.post('/booking/bookShow', { showId, seats, transactionId })
    return response.data
}

const makePayment = async (paymentPayload) => {
    const response = await axiosInstance.post('/booking/makePayment', paymentPayload)
    return response.data
}

const makePaymentAndBookShow = async (paymentPayload) => {
    const response = await axiosInstance.post('/booking/makePaymentAndBookShow', paymentPayload)
    return response.data
}

export { getAllBookings, bookShow, makePayment, makePaymentAndBookShow }
