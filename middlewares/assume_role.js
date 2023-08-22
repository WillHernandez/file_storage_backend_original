const { STSClient, AssumeRoleCommand } = require("@aws-sdk/client-sts")

module.exports = async (req, res, next) => {
	const client = new STSClient({ 
		region: process.env.S3_REGION,
		credentials: { 
			accessKeyId: process.env.S3_ADMIN_KEY,
			 secretAccessKey: process.env.S3_ADMIN_SECRET_KEY
		}
	})

	const params = { 
		RoleArn: process.env.IAM_ASSUMEROLE_ARN,
		RoleSessionName: `file-storage-role-session-${req.cookies.username}`,
		DurationSeconds: 3600
	}
	const command = new AssumeRoleCommand(params)
	try {
		const response = await client.send(command)
		req.Credentials = response.Credentials
		next()
	} catch(e) { 
		res.status(400).json({error: e})
	}
}