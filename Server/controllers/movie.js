import MovieModel from '../models/movieSchema.js'

const addMovie = async (req, res) => {
    try {   
        const { name, description, duration, language, genre, releaseDate, poster } = req.body
        // if movie with same name already exists, throw an error
        const existingMovie = await MovieModel.findOne({ name })
        if(existingMovie) {
            return res.json({
                success: false,
                message: 'Movie with same name already exists'
            })
        }
        const newMovie  = new MovieModel({ name, description, duration, language, genre, releaseDate, poster })
        await newMovie.save()
        res.json({
            success: true,
            message: 'Movie added successfully'
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

const getAllMovies = async (req, res) => {
    try {
        const movies = await MovieModel.find()
        res.json({
            success: true,
            message: 'All Movies fetched successfully',
            movies
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

const getMovieById = async (req, res) => {
    try {
        const movie = await MovieModel.findById(req.params.movieId)
        res.json({
            success: true,
            message: 'Movie fetched successfully',
            data: movie
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

const updateMovie = async (req, res) => {
    try {
        const { movieId } = req.body
        const { name, description, duration, language, genre, releaseDate, poster } = req.body
        const updatedMovie = await MovieModel.findByIdAndUpdate(movieId, { name, description, duration, language, genre, releaseDate, poster }, { new: true })
        res.json({
            success: true,
            message: 'Movie updated successfully',
            updatedMovie
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

const deleteMovie = async (req, res) => {
    try {
        const { movieId } = req.body
        await MovieModel.findByIdAndDelete(movieId)
        res.json({
            success: true,
            message: 'Movie deleted successfully'
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

export { addMovie, getAllMovies, getMovieById, updateMovie, deleteMovie }

