const express = require('express')
const app = express()
const port = process.env.PORT || 4000;
const cors = require('cors')
require('dotenv').config()
const personRouter = require('./routes/person-router');

app.use(cors({origin: "*"}));
app.use(express.json());
app.use('/auth', personRouter);

app.listen(port, () => {
	console.log(`http://localhost:${port}/`)
})

module.exports = app



