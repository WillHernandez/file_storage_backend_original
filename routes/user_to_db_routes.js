const express = require('express')
const router = express.Router()
const {
	addUser,
	getUser,
	deleteUser
	}= require('../controllers/user_to_db_controllers')

router.post('/addUser', addUser)
router.get('/getUser', getUser)
router.delete('/deleteUser', deleteUser)

module.exports = router