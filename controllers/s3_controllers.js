const { 
	S3Client,
	PutObjectCommand, 
	GetObjectCommand, 
	ListObjectsV2Command,
	DeleteObjectCommand,
} = require("@aws-sdk/client-s3")

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner")
const { postRedisCache, addToRedisCache, removeFromRedisCache } =  require('../middlewares/redis_cache')

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
	})

	const fileIsDuplicate = file => {
		let fileName = `home/${req.user.username}/${file.originalname}`
		if(s3ObjectFileNames.has(fileName)) {
			fileName = `home/${req.user.username}/copy_${file.originalname}`
		}
		// update set for fast lookup
		s3ObjectFileNames.add(fileName)
		return fileName
	}

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
		await addToRedisCache(req, res, urlsArr)
	} catch(e) {
		res.status(400).json({error: e})
	}
}

const deleteObjects = async (req, res) => {
	const { AccessKeyId, SecretAccessKey, SessionToken } = req.Credentials
	const client = new S3Client({
		region: process.env.S3_REGION,
		credentials: {
			accessKeyId: AccessKeyId,
			secretAccessKey: SecretAccessKey,
			sessionToken: SessionToken
		}
	})

	// extract file name from presigned Url, currently only passing one file but will make possible to mass delete photos with below map
	const fileNames = req.body.urls.map(file => {
		const lowerFile = file.toLowerCase()
		const start = lowerFile.indexOf('home')
		if(lowerFile.indexOf('.jpg') !== -1) {
			return decodeURIComponent(file.slice(start, lowerFile.indexOf('.jpg') + 4))
		}
		if(lowerFile.indexOf('.jpeg') !== -1) {
			return decodeURIComponent(file.slice(start, lowerFile.indexOf('.jpeg') + 5))
		}
		if(lowerFile.indexOf('.png') !== -1) {
			return decodeURIComponent(file.slice(start, lowerFile.indexOf('.png') + 4))
		}
	})

	const deleteCommands = fileNames.map(file => 
		new DeleteObjectCommand({
			Bucket: process.env.S3_BUCKET_NAME,
			Key: file
		})
	)

	// remove files from redis cache
	fileNames.forEach(file => s3ObjectFileNames.delete(file))

	try {
		const commands = await Promise.all(deleteCommands)
		await Promise.all(commands.map(cmd => client.send(cmd)))
		await removeFromRedisCache(req, res)
	} catch(e) {
		res.status(400).json(e)
	}
}

const getAllObjectsFromS3Bucket = async (req, res, client) => {
	const getAllCommand = new ListObjectsV2Command({
    Bucket: process.env.S3_BUCKET_NAME, 
    MaxKeys: 100,
  })

	s3ObjectFileNames.clear()
  try {
    let isTruncated = true
    while (isTruncated) {
      const { Contents, IsTruncated, NextContinuationToken } = await client.send(getAllCommand)
			Contents.map((c) => {
				if(c.Key.startsWith(`home/${req.user.username}`))
						s3ObjectFileNames.add(c.Key)
				})
      isTruncated = IsTruncated
      getAllCommand.input.ContinuationToken = NextContinuationToken
    }
		return
  } catch (err) {
    console.error(err)
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
	})

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
		await postRedisCache(req, res, urls)
	} catch(e) {
		res.status(400).json({error: e})
	}
}

module.exports = {
	uploadObjects,
	deleteObjects,
	getPresignedUrls
}