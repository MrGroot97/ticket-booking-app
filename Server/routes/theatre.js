import express from 'express'
import { addTheatre, getAllTheatres, getTheatreById, getAllTheatresByOwnerId, updateTheatre, deleteTheatre } from '../controllers/theatre.js'
const router = express.Router()

router.post('/add', addTheatre)
router.get('/getAll', getAllTheatres)
router.get('/getByUserId/:userId', getTheatreById)
router.get('/getAllByOwnerId/:ownerId', getAllTheatresByOwnerId)
router.patch('/update/:theatreId', updateTheatre)
router.delete('/delete/:theatreId', deleteTheatre)

export default router