const multer = require('multer')

const fileFilter = (req, file, cb) => {
	const fileType = file.mimetype.split('/')[0] 
	if(fileType === "image" || fileType === "video")	{
		cb(null, true)
	} else {
		cb(null, false)
	}
}

module.exports = multer({
	storage: multer.memoryStorage(),
	fileFilter,
	limits: {
		fileSize: 1000000000,
		files: 50
	}
}).array('file')