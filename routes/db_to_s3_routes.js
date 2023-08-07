const express = require('express')
const router = express.Router()
const { multerMiddleWare } = require('../middlewares/multerMiddleware.js')
const { convertHeic } = require('../middlewares/convert_heic')

const { 
	uploadObjects,
	getSingleObject,
	getAllObjectsFromS3Bucket
} = require('../controllers/db_to_s3_controllers')

router.post('/upload', multerMiddleWare, (req, res, next) => next(), convertHeic, uploadObjects)
router.get('/getobject', getSingleObject)
router.get('/getallobjects', getAllObjectsFromS3Bucket)

module.exports = router