const express = require('express')
const router = express.Router()
const app = express()
const multer = require('multer') // to be run as middleware prior to calling the controller function.. will handle and sort files prior to uploading
// const multerUtil = require('../utils/multerUtil')
const { 
	createAndUploadToFolder,
	getObject
} = require('../controllers/db_to_s3_controllers')

const storage = multer.memoryStorage()
const fileFilter = (req, file, cb) => {
	if(file.mimeType.split('/')[0] === "image")	{
		cb(null, true)
	} else {
		cb(new multi.MulterError("LIMIT_UNEXPECTED_FILE", false))
	}
}
const upload = multer({
	storage,
	fileFilter,
	limits: {
		fileSize: 1000000000,
		files: 50
	}
})
const multerMiddleWare = upload.array('file', 50)

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