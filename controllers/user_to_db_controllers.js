const axios = require('axios')
const dbApi = process.env.DB_API_URL

const addUser = async (req, res) => {
	const body = req.body;
	try {
		const response = await axios.post(dbApi, {body})
		res.status(200).json(response.data)
	} catch(e) {

	}
}

const getUser = async (req, res) => {

}

const deleteUser = async (req, res) => {

}

module.exports = {
	addUser,
	getUser,
	deleteUser
}