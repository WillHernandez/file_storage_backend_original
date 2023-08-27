const express = require('express')
const router = express.Router()
const multerMiddleWare = require('../middlewares/multerMiddleware.js')
const convertHeic = require('../middlewares/convert_heic')
const assumeRole = require('../middlewares/assume_role.js')
const { getRedisCache } = require('../middlewares/redis_cache.js')

const { uploadObjects, deleteObjects, getPresignedUrls } = require('../controllers/s3_controllers.js')

router.post('/upload', multerMiddleWare, (req, res, next) => next(), convertHeic, assumeRole, uploadObjects)

router.post('/delete', assumeRole, deleteObjects)

router.get('/getallobjects', getRedisCache, assumeRole, getPresignedUrls)

module.exports = router