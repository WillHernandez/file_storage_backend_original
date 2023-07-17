const { 
	S3Client,
	PutObjectCommand, 
	GetObjectCommand, 
	DeleteObjectCommand,
} = require("@aws-sdk/client-s3")

const accessKey = process.env.AWS_ACCESS_KEY
const secretKey = process.env.AWS_SECRET_KEY

const s3_Client = new S3Client({ region: "us-east-1", accessKey, secretKey })
const { v4: uuidv4 } = require('uuid')

// https://stackoverflow.com/questions/9517198/can-i-update-an-existing-amazon-s3-object

// uploading a new bucket to a place with an existing bucket will overwrite the existing bucket. we must first get the current bucket, add new items to it than upload / replace
	
const uploadObjects = async (req, res) => {
	const putCommands = req.files.map(file => new PutObjectCommand({
		Body: file.buffer,
		Bucket: process.env.S3_BUCKET_NAME,
		Key: `${req.cookies.username}/${uuidv4()}_${file.originalname}`
	}))

	Promise.all(putCommands)
		.then(putCommand => Promise.all(putCommand.map(sendPut => s3_Client.send(sendPut))))
		.then(res.status(200).json({uploadObjects: "success"}))
		.catch(e => console.log({error: e}))

}

const getObjects = async (req, res) => {
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
	uploadObjects,
	getObjects
}