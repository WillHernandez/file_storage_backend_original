const supertest = require('supertest')
// const app = require('../server')
const backend_url = 'http://localhost:4000'


// working code template
// const response = await supertest(app).get('/api')
// expect(response.status).toEqual(200);
// also works
// const response = await supertest("http://localhost:4000").get('/api')

// benefits of using the url rather than the app objects is we can debug our tests
describe("Permission - AWS IAM api requests", () => {
	const data = {
		username: `testUser_${Math.floor(Math.random()*898)+101}@tester.com`
	}

	it('Successfully creates a new AWS IAM user on first successful login', async () => {
		const response = await supertest(backend_url).post('/api/user/newuser').send(data)
		expect(response.status).toEqual(200);
	})

	// it('Returns a status of 409 if the user AWS IAM user already exists', async () => {
	// 	const response = await supertest(backend_url).post('/api/user/newuser').send(data)
	// 	expect(response.status).toEqual(409);
	// })

	// it('Deletes an AWS IAM user and returns a status of 200', async () => {
	// 	const response = await supertest(backend_url).post('/api/user/deleteuser').send(data)
	// 	expect(response.status).toEqual(200);
	// })
})
