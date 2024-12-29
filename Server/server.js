import express from 'express'
import dotenv from 'dotenv'
import helmet from 'helmet'
import { rateLimit } from 'express-rate-limit'
import ExpressMongoSanitize from 'express-mongo-sanitize'
import cors from 'cors'
import connectDB from './config/db.js'
import userRoutes from './routes/user.js'
import movieRoutes from './routes/movie.js'
import theatreRoutes from './routes/theatre.js'
import showRoutes from './routes/show.js'
import bookingRoutes from './routes/booking.js'
import validateJWTToken from './middlewares/auth.js'
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the directory name
dotenv.config()
connectDB()

const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again after 15 minutes'
})
const app = express()
const clientBuildPath = path.join(__dirname,"../Client/dist")
app.use(express.static(clientBuildPath)); // for serving client build of react app

app.use(express.json())
// ip whitelisting can be done here
// app.use(cors({
//     origin: 'http://localhost:5173',
//     credentials: true
// })) // cross origin resource sharing to allow requests from frontend to backend
app.use(cors());
app.use(helmet()) // client side atatcks prevention
app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "example.com"], // Allow scripts from 'self' and example.com
        styleSrc: ["'self'", "'unsafe-inline'"], // Allow inline styles (unsafe)
        imgSrc: ["'self'", "data:", "example.com"], // Allow images from 'self', data URLs, and example.com
        connectSrc: ["'self'", "api.example.com"], // Allow connections to 'self' and api.example.com
        fontSrc: ["'self'", "fonts.gstatic.com"], // Allow fonts from 'self' and fonts.gstatic.com
        objectSrc: ["'none'"], // Disallow object, embed, and applet elements
        upgradeInsecureRequests: [], // Upgrade insecure requests to HTTPS
      },
    })
);
// app.use(helmet.dnsPrefetchControl()); // controls browser DNS prefetching
// app.use(helmet.expectCt()); // helps mitigate risk associated with content sniffing
// app.use(helmet.frameguard()); // prevent clickjacking
// app.use(helmet.hidePoweredBy()); // remove the X-Powered-By header
// app.use(helmet.hsts()); // HTTP Strict Transport Security
// app.use(helmet.ieNoOpen()); // sets X-Download-Options for IE8+
// app.use(helmet.noSniff()); // prevent browsers from trying to guess ("sniff") the MIME type
// app.use(helmet.permittedCrossDomainPolicies()); // controls Adobe Flash Player's cross-domain policies
// app.use(helmet.referrerPolicy()); // hide the Referer header
// app.use(helmet.xssFilter()); // prevent reflected XSS attacks
// app.use(helmet.featurePolicy()); // controls browser features
// app.use(helmet.noCache()); // disable client-side caching
// to prevent from sql injection
// app.use(helmet.noSQLInjection()); // prevent NoSQL Injection
// for sql injection, we can also santization of inputs
app.use(ExpressMongoSanitize())
app.use('/api', rateLimiter) // apply rate limiter to all routes, except the ones that are whitelisted, for prevention of DDoS attacks
app.use('/api/user', userRoutes)
app.use('/api/movie', validateJWTToken, movieRoutes)
app.use('/api/theatre', validateJWTToken, theatreRoutes)
app.use('/api/show', validateJWTToken, showRoutes)
app.use(/\/api\/booking/, validateJWTToken, bookingRoutes)

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})