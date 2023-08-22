const express = require('express')
const app = express()
const port = process.env.PORT || 4000
const cors = require('cors')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const dbS3Routes = require('./routes/db_to_s3_routes')
const userRoutes = require('./routes/user_Routes')
const { validateToken } = require('./middlewares/validateToken.js')
require('dotenv').config()

app.use(express.json())
app.use(cors({ origin: process.env.FRONTEND_URI, credentials: true }))
// const whitelist = [process.env.FRONTEND_URI, 'http://127.0.0.1:55374'];
// const corsOptions = {
// 	origin: (origin, callback) => {
// 		if(whitelist.indexOf(origin) !== -1 || !origin) {
// 			callback(null, true);
// 		} else {
// 			callback(new Error('Not allowed by CORS'));
// 		}
// 	},
// 	optionsSuccessStatus: 200
// }
// app.use(cors(corsOptions));

app.use(cookieParser())
app.use(session({ secret: process.env.SESSION_KEY, httpOnly: false, secure: false, maxAge: 3600000, resave: true, saveUninitialized: true }))

app.use('/api/user', userRoutes)
app.use('/api/bucket', validateToken, dbS3Routes)

app.listen(port, () => {
	console.log(`http://localhost:${port}/`)
})

module.exports = app
