const express = require('express')
const app = express()
const port = process.env.PORT || 4000;
const cors = require('cors')
const userDbRoutes = require('./routes/user_to_db_routes')
const dbS3Routes = require('./routes/db_to_s3_routes')
require('dotenv').config()

app.use(cors({origin: "*"}))
app.use(express.json());
app.use('/api/users', userDbRoutes)
app.use('/api/bucket', dbS3Routes)

app.listen(port, () => {
	console.log(`http://localhost:${port}/`)
})

module.exports = app
