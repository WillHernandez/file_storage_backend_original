const express = require('express')
const router = express.Router()
const { multerMiddleWare } = require('../middlewares/multerMiddleware.js')
const { convertHeic } = require('../middlewares/convert_heic')
const { getRedisCache, postRedisCache } = require('../middlewares/redis_cache.js')
const { assumeRole } = require('../middlewares/assume_role.js')

const { 
	uploadObjects,
	getPresignedUrls
} = require('../controllers/db_to_s3_controllers')

router.post('/upload', multerMiddleWare, (req, res, next) => next(), convertHeic, assumeRole, uploadObjects)
router.get('/getallobjects', getRedisCache, assumeRole, getPresignedUrls,)

module.exports = router