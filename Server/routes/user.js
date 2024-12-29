import express from 'express'
import { registerUser, loginUser, getCurrentUser, forgetPassword, resetPassword } from '../controllers/user.js'
import validateJWTToken from '../middlewares/auth.js'

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
// router.get('/logout', logoutUser)
router.post('/forgetPassword', forgetPassword)
router.post('/resetPassword', resetPassword)
router.get('/getCurrentUser', validateJWTToken, getCurrentUser)

export default router