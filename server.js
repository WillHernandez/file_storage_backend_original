const express = require('express')
const app = express()
const port = process.env.PORT || 4000
const cors = require('cors')
const cookieParser = require('cookie-parser')
const S3Routes = require('./routes/s3_routes')
const userRoutes = require('./routes/user_routes')
const validateToken = require('./middlewares/validateToken.js')
require('dotenv').config()

app.use(express.json())
app.use(cookieParser())
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }))

app.use('/api/user', userRoutes)
app.use('/api/bucket', S3Routes)

app.listen(port)

module.exports = app
