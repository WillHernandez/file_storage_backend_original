const multer = require('multer')

const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
	if(file.mimetype.split('/')[0] === "image")	{
		cb(null, true)
	} else {
		cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", false))
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

module.exports = upload.array('file')