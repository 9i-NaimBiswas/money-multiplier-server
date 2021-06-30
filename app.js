const express = require('express');
const mongoose = require('mongoose');
const db = require("./db/conn")
const dotenv = require('dotenv');
require('dotenv').config()
const app = express();
const bodyParser = require("body-parser")
const cors = require('cors')

const auth = require("./routes/auth")










app.use(cors())
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/', (req, res) => {
   res.send("Welcome to Money multiplier world")
})

app.use('/api', auth);






















const PORT = 3001 || process.env.PORT;


app.listen(PORT, () => {
   console.log(`server running at port no. ${PORT}`);
   db
});
