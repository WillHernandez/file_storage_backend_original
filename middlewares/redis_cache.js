const { createClient } = require('redis')
const redisClient = createClient()
redisClient.connect()

redisClient.on('error', err => console.log('Redis Client Error', err))

const postRedisCache = async (req, res, payload) => {
	try {
		await redisClient.set("imageUrls", JSON.stringify(payload))
		res.status(200).json(payload)
	} catch(e) {
		res.status(400).json({error: e})
	}
}

const getRedisCache = async (req, res, next) => {
	const urlsArr = await redisClient.get('imageUrls')
	if(urlsArr !== null) {
		const parsedUrlArr = JSON.parse(urlsArr)
		return res.status(200).json(parsedUrlArr)
	}
	next()
}

const updateRedisCache = async (req, res, payload) => {
	const urlsArr = await redisClient.get('imageUrls')	
	const parsedUrlArr = JSON.parse(urlsArr)
	const concatArrays = [...parsedUrlArr, ...payload]
	await redisClient.set("imageUrls", JSON.stringify(concatArrays))
	res.status(200).json(concatArrays)
}

const flushRedis = async () => {
	await redisClient.flushAll()
}

module.exports = {
	postRedisCache,
	getRedisCache,
	updateRedisCache,
	flushRedis
}