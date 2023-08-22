const { GetUserCommand, CognitoIdentityProviderClient } = require("@aws-sdk/client-cognito-identity-provider")

module.exports = async (req, res, next) => {
  const client = new CognitoIdentityProviderClient({ 
    region: process.env.S3_REGION,
    credentials: {
      accessKeyId: process.env.S3_ADMIN_KEY,
		  secretAccessKey: process.env.S3_ADMIN_SECRET_KEY
    }
  })
  const params = { AccessToken: req.cookies.accessToken }
  const command = new GetUserCommand(params)
  try {
    await client.send(command)
    next()
  } catch (e) {
    res.status(400).json({error: e})
  }
}