const { S3Client } = require("@aws-sdk/client-s3")

const { IAMClient } = require("@aws-sdk/client-iam")

const { CognitoIdentityCredentials } = require('amazon-cognito-identity-js')
const { fromCognitoIdentityPool, fromCognitoIdentity } = require("@aws-sdk/credential-providers")


const getTokensFromCognito = async (req, res, next) => {
	const cognitoS3Client = new S3Client({
		region: 'us-east-1',
		credentials: fromCognitoIdentityPool({
			identityPoolId: 'us-east-1:081a6c68-97bb-45d0-8f60-5eb5f92888f7',
			logins: {
				'cognito-idp.us-east-1.amazonaws.com/us-east-1_A2A68y3tj': req.cookies.idToken
			}
		})
	})

	req.session.cognitoS3Client = cognitoS3Client
	res.end()
}

module.exports = {
	getTokensFromCognito
}