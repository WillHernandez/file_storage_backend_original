const { 
	S3Client,
	PutObjectCommand, 
	GetObjectCommand, 
	ListObjectsV2Command,
	DeleteObjectCommand,
} = require("@aws-sdk/client-s3")

// const accessKey = process.env.AWS_ACCESS_KEY
// const secretKey = process.env.AWS_SECRET_KEY

// const client = new S3Client({ region: "us-east-1", accessKey, secretKey })
const client = new S3Client({ region: "us-east-1" })
const { v4: uuidv4 } = require('uuid')

// https://stackoverflow.com/questions/9517198/can-i-update-an-existing-amazon-s3-object

// uploading a new bucket to a place with an existing bucket will overwrite the existing bucket. we must first get the current bucket, add new items to it than upload / replace
	
const uploadObjects = async (req, res) => {
	const userObjects = await getAllObjectsFromS3Bucket(req, res)
	const putCommands = req.files.map(file => new PutObjectCommand({
		Body: file.buffer,
		Bucket: process.env.S3_BUCKET_NAME,
		Key: userObjects.has(`${req.cookies.username}/${file.originalname}`) ? 
		`${req.cookies.username}/copy_${file.originalname}` : 
		`${req.cookies.username}/${file.originalname}`
	}))

	Promise.all(putCommands)
		.then(putCommand => Promise.all(putCommand.map(sendPut => client.send(sendPut))))
		.then(res.status(200).json({uploadObjects: "success"}))
		.catch(e => console.log({error: e}))
}

const getSingleObject = async (req, res) => {
	const getCommand = new GetObjectCommand({ // hardcoded to testing
		Bucket: process.env.S3_BUCKET_NAME,
		// Key: '107f7414-dcf6-4fba-b1df-ef6cff6c0589.jpg'
	})
	try {
		const result = await client.send(getCommand)
		console.log(result);
	} catch(e) {
		console.log({error: e});
	}
}

const getAllObjectsFromS3Bucket = async (req, res) => {
	const getAllCommand = new ListObjectsV2Command({
    Bucket: process.env.S3_BUCKET_NAME, 
    MaxKeys: 100,
  });

	const contents = new Set()
  try {
    let isTruncated = true;

    while (isTruncated) {
      const { Contents, IsTruncated, NextContinuationToken } = await client.send(getAllCommand);
			Contents.map((c) => {
				if(c.Key.startsWith(req.cookies.username))
					contents.add(c.Key)
				}); 
      isTruncated = IsTruncated;
      getAllCommand.input.ContinuationToken = NextContinuationToken;
    }
		return contents
  } catch (err) {
    console.error(err);
  }
}

const calculateObjectSize = obj => {

}


module.exports = {
	uploadObjects,
	getSingleObject,
	getAllObjectsFromS3Bucket
}