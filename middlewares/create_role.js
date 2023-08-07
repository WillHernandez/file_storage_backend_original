const { STSClient, AssumeRoleCommand } = require("@aws-sdk/client-sts")
const { CreateRoleCommand, IAMClient } = require("@aws-sdk/client-iam")

const client = new IAMClient({
	credentials: { // need to use some keys
		accessKeyId: process.env.S3_ADMIN_KEY,
		secretAccessKey: process.env.S3_ADMIN_SECRET_KEY
	},
	region: process.env.S3_REGION
});

const createRole = async (req, res, next) => {
	const user = req.cookies.username
  const command = new CreateRoleCommand({
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Principal: {
            "AWS": `arn:aws:iam::666073547644:user/${user}`
          },
          Action: "sts:AssumeRole",
        },
      ],
    RoleName: `file-storage-assumerole-${user}`,
  });

	try {
		await client.send(command)
		res.status(200)
	} catch(e) {
		res.status(400).json({error: e})	
	}
};

module.exports = {
	createRole
}