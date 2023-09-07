require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 4000
const cors = require('cors')
const S3Routes = require('./routes/s3_routes')
const userRoutes = require('./routes/user_routes')

app.use(express.json())
app.use(cors({ origin: "*" }))

app.use('/api/test', (req, res) => res.status(200).json('Test Successful!'))
app.use('/api/user', userRoutes)
app.use('/api/bucket', S3Routes)

app.listen(port)

module.exports = app
