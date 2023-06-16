const { DynamoDBClient, GetItemCommand } = require("@aws-sdk/client-dynamodb")
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb')
const ddbClient = new DynamoDBClient({ region: "us-east-1" })

const addUser = async (req, res) => {

}

const getUser = async (req, res) => {
	const params = {
		"TableName": "file_storage_users_db",
		"Key": marshall({ "sub": req.params.sub, "email": req.params.email})
	};
	try {
		const command = new GetItemCommand(params);
		const resData = await ddbClient.send(command);
		if(resData) {
			// use res link to s3 bucket, retrieve images and return them to the frontend
			console.log(unmarshall(resData.Item));
			// res.status(200).json({objectreturnedfroms3bucket})
		}
	} catch(e) {
		res.status(400).json({error: "user not in db"})
	}
}

const deleteUser = async (req, res) => {

}

module.exports = {
	addUser,
	getUser,
	deleteUser
}