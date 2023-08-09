const express = require('express')
const router = express.Router()
const { createIamUser } = require('../middlewares/create_iam_user')
const { assumeRole } = require('../middlewares/assume_role.js')

router.post('/newuser', createIamUser, assumeRole)
router.post('/login', assumeRole)
router.get('/logout', (req, res) => {
	req.session.destroy()
	res.end()
})

module.exports = router