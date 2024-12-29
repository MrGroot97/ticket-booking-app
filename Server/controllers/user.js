import User from '../models/userSchema.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import EmailHelper from '../services/mail/email.js'

const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body
        const userExists = await User.findOne({ email })
        if (userExists) {
            return res.status(200).json({ 
                success: false,
                message: "User already exists. Please login."
            })
        }
        const salt = await bcrypt.genSalt(10) // 2^10 = 1024, more salt means more secure, number of rounds of hashing
        const hashedPassword = await bcrypt.hash(password, salt)
        const newUser = await User.create({ name, email, password: hashedPassword, role })
        await newUser.save()
        res.status(201).json({ 
            success: true,
            message: "User created successfully",
            newUser
        })
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message
        })
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(200).json({ 
                success: false,
                message: "User not found. Please register first."
            })
        }
        const validatePassword = await bcrypt.compare(password, user.password)
        if (!validatePassword) {
            return res.status(200).json({ 
                success: false,
                message: "Please enter valid password"
            })
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' })
        res.status(200).json({ 
            success: true,
            message: "Login successful",
            data: {
                user,
                token
            }
        })
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message
        })
    }
}

const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId
        const user = await User.findById(userId).select('-password -refreshToken')
        res.status(200).json({ 
            success: true,
            message: "User fetched successfully",
            user
        })
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message
        })
    }
}

const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body
        if(!email) {
            return res.status(401).json({ 
                success: false,
                message: "Please enter your email for forget password"
            })
        }
        const user = await User.findOne({ email })
        if(!user) {
            return res.status(200).json({ 
                success: false,
                message: "User not found. Please register first."
            })
        }
        if(user.otpExpiry > Date.now()) {
            return res.status(200).json({ 
                success: false,
                message: "OTP already sent. Please check your email"
            })
        }
        const otp = Math.floor(100000 + Math.random() * 900000)
        user.otp = otp
        user.otpExpiry = Date.now() + 10 * 60 * 1000 // 10 minutes
        await user.save()
        await EmailHelper('otp.html', user.email, {
            name: user.name,
            otp
        }, 'Reset Password OTP for Movie Ticket Booking')
        res.status(200).json({ 
            success: true,
            message: "OTP sent to your email"
        })
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message
        })
    }
}

const resetPassword = async (req, res) => {
    try {
        const { email, otp, password } = req.body
        if(!email || !otp || !password) {
            return res.status(401).json({ 
                success: false,
                message: "invalid request"
            })
        }
        const user = await User.findOne({ email })
        if(!user) {
            return res.status(404).json({ 
                success: false,
                message: "User not found. Please register first."
            })
        }
        if(user.otp !== otp || user.otpExpiry < Date.now()) {
            return res.status(200).json({ 
                success: false,
                message: "Invalid or expired OTP"
            })
        }
        const salt = await bcrypt.genSalt(10) // 2^10 = 1024, more salt means more secure, number of rounds of hashing
        const hashedPassword = await bcrypt.hash(password, salt)
        user.password = hashedPassword
        user.otp = null
        user.otpExpiry = null
        await user.save()
        res.status(200).json({ 
            success: true,
            message: "Password reset successful"
        })
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message
        })
    }
}

export { registerUser, loginUser, getCurrentUser, forgetPassword, resetPassword }