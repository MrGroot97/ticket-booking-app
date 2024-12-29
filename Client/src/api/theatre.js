import axiosInstance from './index'

export const getAllTheatres = async () => {
    const response = await axiosInstance.get('/theatre/getAll')
    return response.data
}

export const getTheatreByUserId = async (userId) => {
    const response = await axiosInstance.get(`/theatre/getByUserId/${userId}`)
    return response.data
}

export const getAllTheatresByOwnerId = async (ownerId) => {
    const response = await axiosInstance.get(`/theatre/getAllByOwnerId/${ownerId}`)
    return response.data
}

export const addTheatre = async (theater) => {
    const response = await axiosInstance.post('/theatre/add', theater)
    return response.data
}

export const updateTheatre = async (theater) => {
    const response = await axiosInstance.patch(`/theatre/update/${theater.theaterId}`, theater)
    return response.data
}

export const deleteTheatre = async (id) => {
    const response = await axiosInstance.delete(`/theatre/delete/${id}`)
    return response.data
}


