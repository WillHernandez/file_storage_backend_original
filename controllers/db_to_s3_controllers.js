const { 
	S3Client,
	PutObjectCommand, 
	GetObjectCommand, 
	ListObjectsV2Command,
	DeleteObjectCommand,
} = require("@aws-sdk/client-s3")

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner")
// const { v4: uuidv4 } = require('uuid')

const uploadObjects = (req, res) => {
	const client = new S3Client({
		region: 'us-east-1',
		credentials: {
			accessKeyId: req.session.Credentials.AccessKeyId,
			secretAccessKey: req.session.Credentials.SecretAccessKey,
			sessionToken: req.session.Credentials.SessionToken
		}
	});


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
		.catch(e => { console.log(e); res.status(400).json({error: e}) })
}

const getSingleObject = async (req, res) => {
	const getCommand = new GetObjectCommand({ // hardcoded filename for testing
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