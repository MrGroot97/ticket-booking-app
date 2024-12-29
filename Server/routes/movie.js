import express from 'express'
import { addMovie, getAllMovies, getMovieById, updateMovie, deleteMovie } from '../controllers/movie.js'

const router = express.Router()

router.post('/addMovie', addMovie)
router.get('/getAllMovies', getAllMovies)
router.get('/getMovieById/:movieId', getMovieById)
router.patch('/updateMovie', updateMovie)
router.delete('/deleteMovie', deleteMovie)

export default router