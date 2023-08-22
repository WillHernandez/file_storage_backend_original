const express = require('express')
const router = express.Router()
const { createIamUser, deleteIamUser } = require('../middlewares/iam_user_handler')
const { flushRedis } = require('../middlewares/redis_cache')

// populates backend with frontend cookies after successful account creation
router.post('/newuser', async (req, res) => {
	await createIamUser(req, res)
}) 

// populates backend with frontend cookies
router.post('/login', (req, res) => res.sendStatus(200))

router.get('/logout', async (req, res) => {
	req.session.destroy()
	await flushRedis()
	res.clearCookie('Credentials')
	res.sendStatus(200)
})

router.post('/deleteuser', async (req, res) => {
	await deleteIamUser(req, res)
})

module.exports = router