const { STSClient, AssumeRoleCommand } = require("@aws-sdk/client-sts")

const assumeRole = async (req, res, next) => {
	const client = new STSClient({ 
		credentials: { 
			accessKeyId: process.env.S3_ADMIN_KEY,
 		 	secretAccessKey: process.env.S3_ADMIN_SECRET_KEY
		},
		region: process.env.S3_REGION
	});

	const user = req.cookies.username
	const input = { 
		RoleArn: `arn:aws:iam::666073547644:role/File-Storage-Root-AssumeRole`, // required
		RoleSessionName: `file-storage-user-session-${user}`, // required
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

