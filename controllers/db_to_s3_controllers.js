const { 
	S3Client,
	PutObjectCommand, 
	GetObjectCommand, 
	DeleteObjectCommand,
} = require("@aws-sdk/client-s3")
const s3_Client = new S3Client({ region: "us-east-1" })

// more than likely i am not going to create a folder for each new user but rather one bucket to store all users and their items as key/vals
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
const createAndUploadToFolder = async (req, res) => {
	const putCommand = new PutObjectCommand({
		Body: {}, // fill with files from upload form 
		Bucket: `${process.env.BUCKET_NAME}/user:${req.body.email}`,
		Key: req.body.email,
	})
	try {
		const result = await s3_Client.send(putCommand)
		// console.log(`successfully uploaded files to ${req.body.email}`);
		console.log(result);
	} catch(e) {
		console.log({error: e});
	}
}

const calculateObjectSize = obj => {

}


module.exports = {
	createAndUploadToFolder,
}