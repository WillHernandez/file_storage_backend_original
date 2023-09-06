const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const { createIamUser, deleteIamUser } = require('../middlewares/iam_user_handler')
const { flushRedis } = require('../middlewares/redis_cache')

router.post('/newuser', async (req, res) => {
	await createIamUser(req, res)
}) 

// return access token to frontend
router.post('/login', (req, res) => {
	const user = req.body
	const accessToken = jwt.sign(user, process.env.JWT_ACCESS_TOKEN)
	res.status(200).json(accessToken)
})

router.get('/logout', async (req, res) => {
	await flushRedis()
	req.body = null
	res.sendStatus(200)
})

router.post('/deleteuser', async (req, res) => {
	await deleteIamUser(req, res)
})

module.exports = router
