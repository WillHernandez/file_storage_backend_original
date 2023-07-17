const { DynamoDBClient, PutItemCommand, GetItemCommand } = require("@aws-sdk/client-dynamodb")
const ddb_Client = new DynamoDBClient({ region: "us-east-1" })
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb')
const TABLE_NAME = process.env.TABLE_NAME

const addUser = async (req, res) => {
	// const {username, password, sub, accessToken, idToken, refreshToken } = req.body

	const params = {
		"TableName": TABLE_NAME, 
		"Item": marshall({
			"username" : req.body.email,
			"sub" : req.body.sub,
			"s3url": `https://linktobucket_${req.body.email}/s3` // does not need to be store on the db
		})
	}
  const putCommand = new PutItemCommand(params)
	try {
		const clientResponse = await ddb_Client.send(putCommand)
		clientResponse.$metadata.s3url = params.Item.s3url.S
		res.status(200).json(clientResponse.$metadata)
	} catch(e) {
		console.log({error: e});
	}
}

const getUser = async (req, res) => {
	const tableParams = {
		"TableName": TABLE_NAME, 
		"Key": marshall({
			"sub": req.params.sub,
			"email": req.params.email
		})
	}
	const getCommand = new GetItemCommand(tableParams)
	try {
		const clientRes = await ddb_Client.send(getCommand)
		// localStorage.setItem(req.params.email, JSON.stringify(clientRes.Item)) causes fail
		if(clientRes && clientRes.Item) {
			// use res link to s3 bucket, retrieve images and return them to the frontend
			res.status(200).json(unmarshall(clientRes.Item))
		}
	} catch(e) {
		res.status(400).json({error: e})
	}
}

const deleteUser = async (req, res) => {

}

module.exports = {
	addUser,
	getUser,
	deleteUser
}