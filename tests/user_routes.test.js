const supertest = require('supertest')
const backend_url = 'http://localhost:4000'

describe("User routes / permissions - AWS IAM api requests", () => {
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

	it('Logs user in to the backend api/user/login : Status 200', async () => {
		const response = await supertest(backend_url).post('/api/user/login')
		expect(response.status).toEqual(200);
	})

	it('Deletes an AWS IAM user api/user/deleteuser : Status 200', async () => {
		const response = await supertest(backend_url).post('/api/user/deleteuser').send(data)
		expect(response.status).toEqual(200);
	})

	it('Logs user out of the backend api/user/logout : Status 200', async () => {
		const response = await supertest(backend_url).get('/api/user/logout')
		expect(response.status).toEqual(200);
	})
})