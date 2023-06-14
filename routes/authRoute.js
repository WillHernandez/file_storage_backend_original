const express = require('express')
const authRoute = express.Router()
const CognitoExpress = require("cognito-express")
require('dotenv').config()

const cognitoExpress = new CognitoExpress({
	region: "us-east-1",
	cognitoUserPoolId: process.env.USER_POOL_ID,
	tokenUse: "access",
	tokenExpiration: 3600000
});

authRoute.use(function(req, res, next) {
	let accessTokenFromClient = req.headers.accesstoken;
	if (!accessTokenFromClient) return res.status(401).send("Access Token missing from header");

	cognitoExpress.validate(accessTokenFromClient, function(err, response) {
		if (err) return res.status(401).send(err);
		res.locals.user = response;
		next();
	});
});

authRoute.get("/", function(req, res) {
	res.status(200).send("Your API call is authenticated!")
});

module.exports = authRoute

