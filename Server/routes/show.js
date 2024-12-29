import express from 'express'
import { addShow, getAllShows, getShowById, updateShow, deleteShow, getAllShowByTheatre, getAllTheatreByMovie } from '../controllers/show.js'

const router = express.Router()
router.post('/addShow', addShow)
router.get('/getAllShows', getAllShows)
router.get('/getShowById/:showId', getShowById)
router.patch('/updateShow/:showId', updateShow)
router.delete('/deleteShow/:showId', deleteShow)

// in partner page, get all shows by theatre
router.get('/getAllShowByTheatre/:theatreId', getAllShowByTheatre)
// in movie page, get all shows by movie
router.post('/getAllTheatreByMovie/', getAllTheatreByMovie)

export default router
