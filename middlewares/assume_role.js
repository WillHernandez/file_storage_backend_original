const { STSClient, AssumeRoleCommand } = require("@aws-sdk/client-sts")

const assumeRole = async (req, res, next) => {
	const client = new STSClient({ 
		region: process.env.S3_REGION,
		credentials: { 
			accessKeyId: process.env.S3_ADMIN_KEY,
 		 	secretAccessKey: process.env.S3_ADMIN_SECRET_KEY
		}
	});

	const input = { 
		RoleArn: `arn:aws:iam::666073547644:role/File-Storage-Root-AssumeRole`,
		RoleSessionName: `file-storage-user-session-${req.cookies.username}`,
		DurationSeconds: 3600
	}

	try {
		const command = new AssumeRoleCommand(input);
		const response = await client.send(command);
		req.session.Credentials = response.Credentials
		next()
	} catch(e) { 
		res.status(400).json({error: e})
	}
}

module.exports = {
	assumeRole
}

