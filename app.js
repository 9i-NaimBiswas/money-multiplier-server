const mongoose = require('mongoose');
const dotenv = require('dotenv');
require('dotenv').config()
const express = require('express');
const app = express();
const bodyParser = require("body-parser")
const cors = require('cors')

const auth = require("./routes/auth")







// database connection
dotenv.config({ path: './config.env' });
require('./db/conn');


app.use(cors())
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/', (req, res) => {
   res.send("Welcome to Money multiplier world")
})

app.use('/api', auth);
const User = require('./model/userscema');





















const PORT = 3001 || process.env.PORT;

// middleware
const middleware = (req, res, next) => {
   console.log('hello this is middleware');
   next();
};

app.post('/home', middleware, (req, res) => {
   console.log(req.body);
   res.send('this is home');
});

app.listen(PORT, () => {
   console.log(`server running at port no. ${PORT}`);
   // console.log(process.env.ACCOUNT_SID);
});
