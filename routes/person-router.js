const express = require('express')
const router = express.Router()

router.post('/createUser', async (req, res) => {
	res.write('this was a post request')
	res.send()
})
router.get('/loginUser', async (req, res) => {
	res.write('this was a get request')
	res.send()
})
router.delete('/deleteUser', async (req, res) => {
	res.write('this was a delete request')
	res.send()
})

module.exports = router