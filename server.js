const express = require('express')
const app = express()
const port = process.env.PORT || 4000
const cors = require('cors')
const userDbRoutes = require('./routes/user_to_db_routes')
const dbS3Routes = require('./routes/db_to_s3_routes')
const permissionRoutes = require('./routes/permission_routes')
require('dotenv').config()
const { validateToken } = require('./middlewares/validateToken.js')
require('dotenv').config()
const cookieParser = require('cookie-parser')
const session = require('express-session')

app.use(express.json())
app.use(cors())
// app.use(cors({ origin: 'http://localhost:3000/', credentials: true }))
app.use(cookieParser())
app.use(session({ secret: process.env.SESSION_KEY, httpOnly: false, secure: false, maxAge: 3600000 }))

// const isAuthorized = (req, res, next) => {
// 	if(req.session.authorized && req.session.authorized == true) {
// 		next()
// 	} else {
// 		res.status(200).json('user is no longer authorized')
// 	}
// }

app.use('/api/login', async (req, res) => {
		await validateToken(req, res)
		res.end()
})

app.use('/api/logout', (req, res) => {
	req.session.destroy()
	res.end()
})

app.use('/api/users', userDbRoutes)
// app.use('/api/bucket', isAuthorized, dbS3Routes)
app.use('/api/bucket', dbS3Routes)
// app.use('api/permissions', isAuthorized, permissionRoutes)
// app.use('/api/permissions', permissionRoutes)

app.listen(port, () => {
	console.log(`http://localhost:${port}/`)
})

module.exports = app
