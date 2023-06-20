const {
	S3Client,
	CreateBucketCommand,
	GetObjectCommand,
	PutObjectCommand,
	DeleteObjectCommand,
	UploadPartCommand
} = require('@aws-sdk/client-s3')

const s3_Client = new S3Client({})

// more than likely i am not going to create a bucket for each new user but rather one bucket to store all users and their items as key/vals
// const createBucket = async (req, res) => {
// 	const bucketName = `${req.body.email}-filestorage-s3-bucket`
// 	const createCommand = new CreateBucketCommand({ Bucket: bucketName })

// 	try {
// 		await s3_Client.send(createCommand)
// 		console.log(`successfully created bucket ${bucketName}`);
// 	} catch(e) {
// 		console.log({error: e});
// 	}
// }

// https://stackoverflow.com/questions/9517198/can-i-update-an-existing-amazon-s3-object

// uploading a new bucket to a place with an existing bucket will overwrite the existing bucket. we must first get the current bucket, add new items to it than upload / replace
const uploadToBucket = async (req, res) => {
	const putCommand = new PutObjectCommand({
		Bucket: process.env.BUCKET_NAME,
		Key: req.body.email,
		Body: {} // fill with files from upload form 
	})
	try {
		await s3_Client.send(putCommand)
		console.log(`successfully uploaded files to ${req.body.email}`);
	} catch(e) {

	}
}

const calculateObjectSize = obj => {

}


module.exports = {
	createBucket,
	uploadToBucket
}