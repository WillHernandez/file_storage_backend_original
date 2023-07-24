const express = require('express')
const router = express.Router()
const {
		getRole,
		attachRole
	} = require('../controllers/permission_controller')

router.get('/', getRole)
router.post('/', attachRole)

module.exports = router