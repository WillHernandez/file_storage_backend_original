const { 
	S3Client,
	PutObjectCommand, 
	GetObjectCommand, 
	ListObjectsV2Command,
	DeleteObjectCommand,
} = require("@aws-sdk/client-s3")

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner")
const { postRedisCache, updateRedisCache } =  require('../middlewares/redis_cache')

const s3ObjectFileNames = new Set()

const uploadObjects = async (req, res) => {
	const { AccessKeyId, SecretAccessKey, SessionToken } = req.Credentials
	const client = new S3Client({
		region: process.env.S3_REGION,
		credentials: {
			accessKeyId: AccessKeyId,
			secretAccessKey: SecretAccessKey,
			sessionToken: SessionToken
		}
	});

	const fileIsDuplicate = file => {
		let fileName = `home/${req.cookies.username}/${file.originalname}`
		if(s3ObjectFileNames.has(fileName)) {
			fileName = `home/${req.cookies.username}/copy_${file.originalname}`
		}
		// update set for fast lookup
		s3ObjectFileNames.add(fileName)
		return fileName
	}

	// const userObjects = await getAllObjectsFromS3Bucket(req, res)
	const putCommands = req.files.map(file => new PutObjectCommand({
		ContentType: file.mimetype,
		Body: file.buffer,
		Bucket: process.env.S3_BUCKET_NAME,
		Key: fileIsDuplicate(file)
	}))

	try {
		const commands = await Promise.all(putCommands)
		// upload images to s3
		await Promise.all(commands.map(cmd => client.send(cmd))) // req was successful
		// get full s3 objects
		const getCommands = commands.map(cmd =>
			new GetObjectCommand({
				Bucket: process.env.S3_BUCKET_NAME,
				Key: cmd.input.Key
			}), { Expires: 3600 }
		)
		// get presigned urls for all new uploaded objects
		const urlsArr = await Promise.all(getCommands.map(cmd => getSignedUrl(client, cmd)))
		// update redis with new urls and return full urlsArr
		await updateRedisCache(req, res, urlsArr)
	} catch(e) {
		res.status(400).json({error: e})
	}
}

const getAllObjectsFromS3Bucket = async (req, res, client) => {
	const getAllCommand = new ListObjectsV2Command({
    Bucket: process.env.S3_BUCKET_NAME, 
    MaxKeys: 100,
  });

  try {
    let isTruncated = true;
    while (isTruncated) {
      const { Contents, IsTruncated, NextContinuationToken } = await client.send(getAllCommand)
			Contents.map((c) => {
				if(c.Key.startsWith(`home/${req.cookies.username}`))
						s3ObjectFileNames.add(c.Key)
				}); 
      isTruncated = IsTruncated;
      getAllCommand.input.ContinuationToken = NextContinuationToken;
    }
		return
  } catch (err) {
    console.error(err);
  }
}

const getPresignedUrls = async (req, res) => {
	const { AccessKeyId, SecretAccessKey, SessionToken } = req.Credentials

	const client = new S3Client({
		region: process.env.S3_REGION,
		credentials: {
			accessKeyId: AccessKeyId,
			secretAccessKey: SecretAccessKey,
			sessionToken: SessionToken
		}
	});

	await getAllObjectsFromS3Bucket(req, res, client)
	const fileKeyArr = Array.from(s3ObjectFileNames)

	const getCommands = fileKeyArr.map(key =>
		new GetObjectCommand({
			Bucket: process.env.S3_BUCKET_NAME,
			Key: key
		}), { Expires: 3600 }
	)
	
	try {
		const urls = await Promise.all(getCommands.map(cmd => getSignedUrl(client, cmd)))
		return await postRedisCache(req, res, urls)
	} catch(e) {
		res.status(400).json({error: e})
	}
}

module.exports = {
	uploadObjects,
	getAllObjectsFromS3Bucket,
	getPresignedUrls
}