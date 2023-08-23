const heicConvert = require('heic-convert')

module.exports = async (req, res, next) => {
	const heicFileIndx = []
	try {
		const convertedHeicFiles = await Promise.all(req.files.map((file, i) => {
			if(file.mimetype === 'image/heic') {
				heicFileIndx.push(i)
				return heicConvert({
					buffer: file.buffer,
					format: 'JPEG',
					quality: 1
				})
			}
		}))

		heicFileIndx.forEach(i => {
			req.files[i].buffer = convertedHeicFiles[i]
			req.files[i].mimetype = 'image/jpeg'
			req.files[i].originalname = req.files[i].originalname.toLowerCase().replace('.heic', '.jpg')
		})
		next()
	} catch(e) {
		res.status(400).json({error: e})
	}
}