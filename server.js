const express = require('express')
const app = express()
const port = process.env.PORT || 4000
const cors = require('cors')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const dbS3Routes = require('./routes/db_to_s3_routes')
const userRoutes = require('./routes/user_Routes')
require('dotenv').config()
const { validateToken } = require('./middlewares/validateToken.js')
require('dotenv').config()

app.use(express.json())
app.use(cors({ origin: 'http://localhost:3000', credentials: true}))
app.use(cookieParser())
app.use(session({ secret: process.env.SESSION_KEY, httpOnly: false, secure: false, maxAge: 3600000 }))


app.use('/api/user', userRoutes)
app.use('/api/bucket', validateToken, dbS3Routes)

app.listen(port, () => {
	console.log(`http://localhost:${port}/`)
})

module.exports = app
