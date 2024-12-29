import jwt from 'jsonwebtoken'

const validateJWTToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized/ Invalid token'
            })
        }
        if(decoded.exp < Math.floor(Date.now() / 1000)) {
            return res.status(401).json({
                success: false,
                message: 'Token expired'
            })
        }
        req.userId = decoded.userId
        next()
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Unauthorized/ Invalid token'
        })
    }
}

export default validateJWTToken