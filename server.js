const express = require('express')
const app = express()
const port = process.env.PORT || 4000
const cors = require('cors')
const cookieParser = require('cookie-parser')
const S3Routes = require('./routes/s3_routes')
const userRoutes = require('./routes/user_routes')
require('dotenv').config()

app.use(express.json())
app.use(cookieParser())
app.use(cors({ origin: process.env.BACKEND_URL, credentials: true }))

app.use('/api/test', (req, res) => res.status(200).json('Test Successful!'))
app.use('/api/user', userRoutes)
app.use('/api/bucket', S3Routes)

app.listen(port, () => {
  console.log(`connected on http://localhost:${port}`)
})

module.exports = app
