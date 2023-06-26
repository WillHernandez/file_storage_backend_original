const express = require('express')
const router = express.Router()
const { multerMiddleWare } = require('../middlewares/multerMiddleware.js')

const { 
	createAndUploadToFolder,
	getObject
} = require('../controllers/db_to_s3_controllers')

router.post('/upload', multerMiddleWare, (req, res, next) => {
	res.status(200).json({success: "multer success"})
	next()
}, createAndUploadToFolder)

// app.use((error, req, res, next) => {
// 	if(error instanceof multer.MulterError) {
// 		if (error.code === 'LIMIT_FILE_COUNT') {
// 			res.json({message: "Limit to amount of files uploading at one time is 30"})
// 		}
// 	}
// })

router.get('/getobject', getObject)

module.exports = router