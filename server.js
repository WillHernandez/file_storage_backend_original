const express = require('express')
const app = express()
const port = process.env.PORT || 4000;
const cors = require('cors')
require('dotenv').config()
// const authRoute = require('./routes/authRoute')
const userDbRoutes = require('./routes/user_to_db_routes')

app.use(cors({origin: "*"}))
app.use(express.json());
// app.use('/api/verify', authRoute) // if we need to auth route, i believe amplify does this by default
app.use('/api/users', userDbRoutes)

app.listen(port, () => {
	console.log(`http://localhost:${port}/`)
})

module.exports = app



