import axiosInstance from './index'

export const registerUser = async (payload) => {
    const response = await axiosInstance.post('/user/register', payload)
    return response.data
}

export const loginUser = async (payload) => {
    const response = await axiosInstance.post('/user/login', payload)
    return response.data
}

export const getCurrentUser = async () => {
    const response = await axiosInstance.get('/user/getCurrentUser')
    return response.data
}

export const logoutUser = async () => {
    const response = await axiosInstance.get('/user/logout')
    return response.data
}

export const forgetPassword = async (payload) => {
    const response = await axiosInstance.post('/user/forgetPassword', payload)
    return response.data
}

export const resetPassword = async (payload) => {
    const response = await axiosInstance.post('/user/resetPassword', payload)
    return response.data
}