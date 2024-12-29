import Show from '../models/showSchema.js'

const addShow = async (req, res) => {
    try {
        const show = new Show(req.body)
        await show.save()
        res.status(201).json({ show, message: 'Show added successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getAllShows = async (req, res) => {
    try {
        const shows = await Show.find()
        res.status(200).json({ shows })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getShowById = async (req, res) => {
    try {
        const show = await Show.findById(req.params.showId).populate('movie').populate('theatre')
        res.status(200).json({ success: true, data: show, message: 'Show fetched successfully' })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const updateShow = async (req, res) => {
    try {
        const show = await Show.findByIdAndUpdate(req.params.showId, req.body, { new: true })
        res.status(200).json({ show, message: 'Show updated successfully' })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const deleteShow = async (req, res) => {
    try {
        const show = await Show.findByIdAndDelete(req.params.showId)
        res.status(200).json({ success: true, show, message: 'Show deleted successfully' })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const getAllShowByTheatre = async (req, res) => {
    try {
        const shows = await Show.find({ theatre: req.params.theatreId }).populate('movie')
        res.status(200).json({ shows, message: 'Shows fetched successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getAllTheatreByMovie = async (req, res) => {
    try {
        const { movie, date } = req.body
        const shows = await Show.find({ movie, date }).populate('theatre')

        let uniqueTheatres = []
        shows.forEach(show => {
            let isTheatreExists = uniqueTheatres.find(theatre => theatre._id === show.theatre._id)
            if (!isTheatreExists) {
                let showOfThisTheatre = shows.filter(s => s.theatre._id === show.theatre._id)
                uniqueTheatres.push({ ...show.theatre._doc, shows: showOfThisTheatre })
            }
        })
        res.status(200).json({ success: true, data: uniqueTheatres, message: 'Theatres fetched successfully' })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

export { addShow, getAllShows, getShowById, updateShow, deleteShow, getAllShowByTheatre, getAllTheatreByMovie }
