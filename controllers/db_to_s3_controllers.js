const { 
	S3Client,
	PutObjectCommand, 
	GetObjectCommand, 
	ListObjectsV2Command,
	DeleteObjectCommand,
} = require("@aws-sdk/client-s3")

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner")

const { convertHeic } = require('../middlewares/convert_heic')

// const client = new S3Client({ region: "us-east-1" })
// const client = new S3Client({ 
// 	credentials: {
// 		accessKeyId: process.env.S3_ACCESS_KEY,
// 		secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
// 	},
// 	region: "us-east-1"
//  })
// const { v4: uuidv4 } = require('uuid')

// https://stackoverflow.com/questions/9517198/can-i-update-an-existing-amazon-s3-object

// uploading a new bucket to a place with an existing bucket will overwrite the existing bucket. we must first get the current bucket, add new items to it than upload / replace
	
const uploadObjects = async (req, res) => {
	await convertHeic(req.files)
	
	const client = new S3Client({ 
		credentials: {
			accessKeyId: "AKIAZWFITYN6EIW2X5EU",
			secretAccessKey: "rBZdvsj5SNu0Iicb6WO8HVhbBkCdx/Js9qXtAFyR"
		},
		region: "us-east-1"
 	})
	// const userObjects = await getAllObjectsFromS3Bucket(req, res)
	const putCommands = req.files.map(file => new PutObjectCommand({
		ContentType: 'image/jpeg',
		Body: file.buffer,
		Bucket: process.env.S3_BUCKET_NAME,
		Key: `home/${req.cookies.username}/${file.originalname}`
		// Key: userObjects.has(`${req.cookies.username}/${file.originalname}`) ? 
		// `${req.cookies.username}/copy_${file.originalname}` : 
		// `${req.cookies.username}/${file.originalname}`
		
	}))

	Promise.all(putCommands)
		.then(putCommand => Promise.all(putCommand.map(sendPut => client.send(sendPut))))
		.then(res.status(200).json({uploadObjects: "success"}))
		.catch(e => console.log({error: e}))
}

const getSingleObject = async (req, res) => {
	const getCommand = new GetObjectCommand({ // hardcoded to testing
		Bucket: process.env.S3_BUCKET_NAME,
		Key: 'brccklyn86@gmail.com/IMG_0942 copy.HEIC'
	})
	try {
		return await client.send(getCommand)
	} catch(e) {
		console.log({error: e});
	}
}

const getAllObjectsFromS3Bucket = async (req, res) => {
	// const preSigned = await createPresignedUrl()
	// console.log(preSigned);
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

const createPresignedUrl = async () => {
	const obj = await getSingleObject()
	// const userObjects = await getAllObjectsFromS3Bucket(req, res)
	// const keys = Array.from(userObjects)

	const url = await getSignedUrl(client, new GetObjectCommand({ // hardcoded to testing
		Bucket: process.env.S3_BUCKET_NAME,
		Key: 'brccklyn86@gmail.com/IMG_0942 copy.HEIC'
	}), { Expires: 3600 })
  // const urls = keys.map(key => getSignedUrl(

	// ))
	return url
};


module.exports = {
	uploadObjects,
	getSingleObject,
	getAllObjectsFromS3Bucket
}