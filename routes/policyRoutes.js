const express = require('express')
const router = express.Router()
const { newUser } = require('../middlewares/create_iam_user')

router.post('/', newUser)

module.exports = router