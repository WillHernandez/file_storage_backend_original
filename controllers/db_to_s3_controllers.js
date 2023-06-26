const { 
	S3Client,
	PutObjectCommand, 
	GetObjectCommand, 
	DeleteObjectCommand,
} = require("@aws-sdk/client-s3")
const s3_Client = new S3Client({ region: "us-east-1" })
const { v4: uuidv4 } = require('uuid')

// https://stackoverflow.com/questions/9517198/can-i-update-an-existing-amazon-s3-object

// uploading a new bucket to a place with an existing bucket will overwrite the existing bucket. we must first get the current bucket, add new items to it than upload / replace
	
// const createAndUploadToFolder = async (req, res) => {
// 	const putCommand = new PutObjectCommand({
// 		Body: req.files[0].buffer, // fill with files from upload form 
// 		Bucket: process.env.S3_BUCKET_NAME,
// 		Key: `will2code@aol.com/${req.files[0].originalname}_${uuidv4()}`
// 	})
// 	try {
// 		const result = await s3_Client.send(putCommand)
// 		console.log(result);
// 	} catch(e) {
// 		console.log({error: e});
// 	}
// }

const createAndUploadToFolder = async (req, res) => {
	const putCommands = req.files.map(file => new PutObjectCommand({
		Body: file.buffer,
		Bucket: process.env.S3_BUCKET_NAME,
		Key: `${req.body.username}/${uuidv4()}_${file.originalname}`
	}))

	Promise.all(putCommands)
		.then(putCommand => Promise.all(putCommand.map(sendPut => s3_Client.send(sendPut))))
		.catch(e => console.log({error: e}))
	}

const getObject = async (req, res) => {
	const getCommand = new GetObjectCommand({ // hardcoded to testing
		Bucket: process.env.S3_BUCKET_NAME,
		Key: '107f7414-dcf6-4fba-b1df-ef6cff6c0589.jpg'
	})
	try {
		const result = await s3_Client.send(getCommand)
		console.log(result);
	} catch(e) {
		console.log({error: e});
	}
}

const calculateObjectSize = obj => {

}


module.exports = {
	createAndUploadToFolder,
	getObject
}