const express = require('express')
const router = express.Router()
const {
	addUser,
	getUser,
	deleteUser
	}= require('../controllers/user_to_db_controllers')

router.post('/adduser', addUser)
router.get('/getuser/:id', getUser)
router.delete('/deleteuser', deleteUser)

module.exports = router