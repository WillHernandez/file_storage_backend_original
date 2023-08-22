const supertest = require('supertest')
const backend_url = 'http://localhost:4000'

// if passing the backend url into supertest, run server prior so tests can attach
// const response = await supertest("http://localhost:4000").get('/api')
// benefits of using the url rather than the app objects is we can debug our tests

// if using app, do NOT run server prior as a new one will be created and attached to
// const app = require('../server')
// const response = await supertest(app).get('/api')

describe("Permission - AWS IAM api requests", () => {
	const data = {
		username: `testUser_${Math.floor(Math.random()*898)+101}@tester.com`
	}

	it('Creates a new AWS IAM user api/user/newuser : Status 200', async () => {
		const response = await supertest(backend_url).post('/api/user/newuser').send(data)
		expect(response.status).toEqual(200);
	})

	it('If AWS IAM user already exists api/user/newuser : Status 409', async () => {
		const response = await supertest(backend_url).post('/api/user/newuser').send(data)
		expect(response.status).toEqual(409);
	})

	it('Logs in to the backend api/user/login : Status 200', async () => {
		const response = await supertest(backend_url).post('/api/user/login').send(data)
		expect(response.status).toEqual(200);
	})

	it('Deletes an AWS IAM user api/user/deleteuser : Status 200', async () => {
		const response = await supertest(backend_url).post('/api/user/deleteuser').send(data)
		expect(response.status).toEqual(200);
	})
})
