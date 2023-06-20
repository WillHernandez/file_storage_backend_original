const { DynamoDBClient, PutItemCommand, GetItemCommand } = require("@aws-sdk/client-dynamodb")
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb')
const ddb_Client = new DynamoDBClient({ region: "us-east-1" })
const TABLE_NAME = process.env.TABLE_NAME

const addUser = async (req, res) => {
	const params = {
		"TableName": TABLE_NAME, 
		"Item": marshall({
			"sub" : req.body.sub,
			"email" : req.body.email,
			"s3url": `https://linktobucket${req.body.email}/s3`
		})
	}

  const putCommand = new PutItemCommand(params)
	try {
		const clientResponse = await ddb_Client.send(putCommand)
		clientResponse.$metadata.s3url = params.Item.s3url.S
		// return clientResponse.$metadata
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
		if(clientRes && clientRes.Item) {
			// use res link to s3 bucket, retrieve images and return them to the frontend
			res.status(200).json(unmarshall(clientRes.Item))
		} else {
			const user = await addUser(res, res)
			res.status(200).json({success: `${req.params.email} added to DB`})
		}
	} catch(e) {
		res.status(400).json({error: e})
		// addUser(res, res)
	}
}

const deleteUser = async (req, res) => {

}

module.exports = {
	addUser,
	getUser,
	deleteUser
}