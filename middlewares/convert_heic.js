const convert = require('heic-convert');

const convertHeic = async files => {
	const heicFileIndx = []
	try {
		const buffers = await Promise.all(files.map((file, i) => {
			if(file.mimetype === 'image/heic') {
				heicFileIndx.push(i)
				return convert({
					buffer: file.buffer,
					format: 'JPEG',
					quality: 1
				})
			}}))
		heicFileIndx.forEach(i => {
			files[i].buffer = buffers[i]
			files[i].mimetype = 'image/jpeg'
			files[i].originalname = files[i].originalname.toLowerCase().replace('.heic', '.jpg')
		})
		return
	} catch(e) {
		return e
	}
}

module.exports = {
	convertHeic
}