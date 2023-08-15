const express = require('express')
const router = express.Router()
const { createIamUser } = require('../middlewares/create_iam_user')
const { flushRedis } = require('../middlewares/redis_cache')

// populates backend with frontend cookies after successful account creation
router.post('/newuser', async (req, res) => {
	await createIamUser(req, res);
	res.end()
}) 

// populates backend with frontend cookies
router.post('/login', (req, res) => res.end())

router.get('/logout', async (req, res) => {
	req.session.destroy()
	await flushRedis()
	res.clearCookie('Credentials');
	res.end()
})

module.exports = router