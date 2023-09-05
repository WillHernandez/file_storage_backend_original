const { createClient } = require('redis')

const redisClient = createClient({
  password: process.env.REDIS_PW,
  socket: {
    host: 'redis-13240.c10.us-east-1-3.ec2.cloud.redislabs.com',
    port: 13240
  }
});
redisClient.connect()

redisClient.on('error', err => console.log('Redis Client Error', err))

const postRedisCache = async (req, res, payload) => {
  try {
    await redisClient.set("imageUrls", JSON.stringify(payload))
    res.status(200).json(payload)
  } catch (e) {
    res.status(400).json({ error: e })
  }
}

const getRedisCache = async (req, res, next) => {
  const urlsArr = await redisClient.get('imageUrls')
  if (urlsArr && urlsArr.length) {
    const parsedUrlArr = JSON.parse(urlsArr)
    return res.status(200).json(parsedUrlArr)
  }
  next()
}

const addToRedisCache = async (req, res, payload) => {
  const urlsArr = await redisClient.get('imageUrls')
  const parsedUrlArr = JSON.parse(urlsArr)
  const concatArrays = [...parsedUrlArr, ...payload]
  await redisClient.set("imageUrls", JSON.stringify(concatArrays))
  res.status(200).json(concatArrays)
}

const removeFromRedisCache = async (req, res) => {
  const urlsArr = await redisClient.get('imageUrls')
  const urls = new Set(JSON.parse(urlsArr))
  req.body.data.forEach(file => {
    urls.delete(file)
  })
  const arrayFromSet = Array.from(urls)
  await redisClient.set('imageUrls', JSON.stringify(arrayFromSet))
  res.status(200).json(arrayFromSet)
}

const flushRedis = async () => {
  await redisClient.flushAll()
}

module.exports = {
  postRedisCache,
  getRedisCache,
  addToRedisCache,
  removeFromRedisCache,
  flushRedis
}
