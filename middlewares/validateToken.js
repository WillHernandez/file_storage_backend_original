const { GetUserCommand, CognitoIdentityProviderClient } = require("@aws-sdk/client-cognito-identity-provider")
const client = new CognitoIdentityProviderClient({ 
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ADMIN_KEY,
		secretAccessKey: process.env.S3_ADMIN_SECRET_KEY
  }
 })

const validateToken = async (req, res) => {
  const params = { AccessToken: req.cookies.accessToken }
  const command = new GetUserCommand(params)
  try {
    await client.send(command)
    req.session.authorized = true
  } catch (error) {
    req.session.authorized = false
  }
}

module.exports = {
  validateToken
}