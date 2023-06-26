const express = require('express')
const router = express.Router()
const { multerMiddleWare } = require('../middlewares/multerMiddleware.js')

const { 
	uploadObjects,
	getObjects
} = require('../controllers/db_to_s3_controllers')

router.post('/upload', multerMiddleWare, (req, res, next) => next(), uploadObjects)

// should handle errors, not currently working correctly - troubleshoot
// app.use((error, req, res, next) => {
// 	if(error instanceof multer.MulterError) {
// 		if (error.code === 'LIMIT_FILE_COUNT') {
// 			res.json({message: "Limit to amount of files uploading at one time is 30"})
// 		}
// 	}
// })

router.get('/getobject', getObjects)

module.exports = router