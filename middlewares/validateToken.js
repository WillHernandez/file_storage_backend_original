const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.S3_REGION }); // Set your AWS region
const cognito = new AWS.CognitoIdentityServiceProvider();

const validateToken = async (req, res, next) => {
  try {
    const params = {
      AccessToken: req.cookies.accessToken
    };
    await cognito.getUser(params).promise();
    req.session.authorized = true
  } catch (error) {
    req.session.authorized = false
  }
};

module.exports = {
  validateToken
}