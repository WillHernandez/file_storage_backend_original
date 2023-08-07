const { STSClient, AssumeRoleCommand } = require("@aws-sdk/client-sts")

const assumeRole = async (req, res) => {
	const client = new STSClient({ 
		region: process.env.S3_REGION,
		credentials: { 
			accessKeyId: process.env.S3_ADMIN_KEY,
 		 	secretAccessKey: process.env.S3_ADMIN_SECRET_KEY
		}
	});

	const input = { 
		RoleArn: process.env.IAM_ASSUMEROLE_ARN,
		RoleSessionName: `file-storage-role-session-${req.cookies.username}`,
		DurationSeconds: 3600
	}

	try {
		const command = new AssumeRoleCommand(input)
		const response = await client.send(command)
		req.session.Credentials = response.Credentials
	} catch(e) { 
		return res.status(400).json({error: e})
	}
}

module.exports = {
	assumeRole
}

