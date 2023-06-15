const axios = require('axios')

const addUser = async (req, res) => {
	const body = req.body;
	try {
		const response = await axios.post(process.env.DB_API_URL, {body})
		res.status(200).json(response.data)
	} catch(e) {

	}
}

const getUser = async (req, res) => {
	const id = req.params.id
	try {
		const response = await axios.get(`${process.env.DB_API_URL}/${id}`)
		res.status(200).json(response.data)
	} catch(e) {
		console.log({error: e});
	}
}

const deleteUser = async (req, res) => {

}

module.exports = {
	addUser,
	getUser,
	deleteUser
}