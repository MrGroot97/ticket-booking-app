import axiosInstance from './index'

const getAllMovies = async () => {
    const response = await axiosInstance.get('/movie/getAllMovies')
    return response.data
}

const updatedMovie = async (movie) => { 
    const response = await axiosInstance.patch('/movie/updateMovie', movie)
    return response.data
}

const addMovie = async (movie) => {
    const response = await axiosInstance.post('/movie/addMovie', movie)
    return response.data
}

const deleteMovie = async (movieId) => {
    const response = await axiosInstance.delete(`/movie/deleteMovie/`,{
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        data: {
            movieId
        }
    })
    return response.data
}

const getMovieById = async (movieId) => {
    const response = await axiosInstance.get(`/movie/getMovieById/${movieId}`)
    return response.data
}

export { getAllMovies, updatedMovie, addMovie, deleteMovie, getMovieById }