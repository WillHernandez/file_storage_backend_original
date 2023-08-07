const express = require('express')
const router = express.Router()
const { newUser } = require('../middlewares/create_iam_user')
// const { createRole } = require('../middlewares/create_role.js')

// router.post('/', newUser, createRole)
router.post('/', newUser)

module.exports = router