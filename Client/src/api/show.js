import axiosInstance from './index'

const getAllShows = async () => {
    const response = await axiosInstance.get('/show/getAllShows')
    return response.data
}

const getShowById = async (showId) => {
    const response = await axiosInstance.get(`/show/getShowById/${showId}`)
    return response.data
}

const addShow = async (showPayload) => {
    const response = await axiosInstance.post('/show/addShow', showPayload)
    return response.data
}

const updateShow = async (show) => {
    const response = await axiosInstance.patch(`/show/updateShow/${show.showId}`, show)
    return response.data
}

const deleteShow = async (showId) => {
    const response = await axiosInstance.delete(`/show/deleteShow/${showId}`)
    return response.data
}

const getAllShowByTheatre = async (theatreId) => {
    const response = await axiosInstance.get(`/show/getAllShowByTheatre/${theatreId}`)
    return response.data
}

const getAllTheatreByMovie = async ({ movieId, date }) => {
    const response = await axiosInstance.post(`/show/getAllTheatreByMovie`, { movie: movieId, date })
    return response.data
}

export { getAllShows, getShowById, addShow, updateShow, deleteShow, getAllShowByTheatre, getAllTheatreByMovie }