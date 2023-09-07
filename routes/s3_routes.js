const express = require('express')
const router = express.Router()
const multerMiddleWare = require('../middlewares/multerMiddleware.js')
const convertHeic = require('../middlewares/convert_heic')
const assumeRole = require('../middlewares/assume_role.js')
const jwttoken = require('../middlewares/jwt_token.js')
const awstoken = require('../middlewares/aws_token.js')
const { getRedisCache } = require('../middlewares/redis_cache.js')

const { uploadObjects, deleteObjects, getPresignedUrls } = require('../controllers/s3_controllers.js')

router.post('/upload', jwttoken, awstoken, multerMiddleWare, (req, res, next) => next(), convertHeic, assumeRole, uploadObjects)

router.get('/getallobjects', jwttoken, awstoken, getRedisCache, assumeRole, getPresignedUrls)

router.post('/delete', jwttoken, assumeRole, deleteObjects)

module.exports = router
