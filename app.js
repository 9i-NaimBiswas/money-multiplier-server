const mongoose = require('mongoose');
const dotenv = require('dotenv');
const express = require('express');
const app = express();

// database connection
dotenv.config({ path: './config.env' });
require('./db/conn');

app.use(express.json());
app.use(require('./routes/auth'));
const User = require('./model/userscema');

const PORT = process.env.PORT;

const config = require('./Config');

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
