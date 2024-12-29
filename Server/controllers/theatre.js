import Theatre from '../models/theatreSchema.js'

const addTheatre = async (req, res) => {
    try {
        const { name, address, phone, email, owner, isActive } = req.body
        const theatre = new Theatre({ name, address, phone, email, owner, isActive })
        await theatre.save()
        res.json({
            success: true,
            message: "Theatre added successfully",
            theatre
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

const getAllTheatres = async (req, res) => {
    try {
        const allTheatres = await Theatre.find().populate('owner')
        res.json({
            success: true,
            message: "Theatres fetched successfully",
            data: allTheatres
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

const getTheatreById = async (req, res) => {
    try {
        const { theatreId } = req.params
        const theatre = await Theatre.findById(theatreId)
        res.json({
            success: true,
            message: "Theatre fetched successfully",
            theatre
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

const getAllTheatresByOwnerId = async (req, res) => {
    try {
        const { ownerId } = req.params
        const theatres = await Theatre.find({ owner: ownerId }).populate('owner')
        res.json({
            success: true,
            message: "Theatres fetched successfully",
            data: theatres
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

const updateTheatre = async (req, res) => {
    try {
        const { theatreId } = req.params
        const { name, address, phone, email, owner, isActive } = req.body
        const theatre = await Theatre.findByIdAndUpdate(theatreId, { name, address, phone, email, owner, isActive }, { new: true })
        res.json({
            success: true,
            message: "Theatre updated successfully",
            theatre
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

const deleteTheatre = async (req, res) => {
    try {
        const { theatreId } = req.params
        await Theatre.findByIdAndDelete(theatreId)
        res.json({
            success: true,
            message: "Theatre deleted successfully"
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

export { addTheatre, getAllTheatres, getTheatreById, getAllTheatresByOwnerId, updateTheatre, deleteTheatre }