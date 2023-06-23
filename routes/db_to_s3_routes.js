const express = require('express')
const router = express.Router()
const app = express()
const multer = require('multer') // to be run as middleware prior to calling the controller function.. will handle and sort files prior to uploading
// const multerUtil = require('../utils/multerUtil')
const { 
	createAndUploadToFolder,
} = require('../controllers/db_to_s3_controllers')

const upload = multer({ dest: 'uploads/' })
const multerMiddleWare = upload.array('file', 2)

router.post('/upload', multerMiddleWare, (req, res) => {
	res.status(200).json({success: "multer success"})
})

// app.use((error, req, res, next) => {
// 	if(error instanceof multer.MulterError) {
// 		if (error.code === 'LIMIT_FILE_COUNT') {
// 			res.json({message: "Limit to amount of files uploading at one time is 30"})
// 		}
// 	}
// })

// router.get('/retrieveBucketFolder')

module.exports = router