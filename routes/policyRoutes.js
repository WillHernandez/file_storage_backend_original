const express = require('express')
const router = express.Router()
const { createIamUser } = require('../middlewares/create_iam_user')

router.post('/', createIamUser)

module.exports = router