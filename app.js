const express = require('express');
const app = express();
const db = require("./db/conn")

const cors = require('cors')
const bodyParser = require("body-parser")


require('dotenv').config()
const auth = require("./routes/auth")






app.use(cors())
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use('/api', auth);


app.get('/', (req, res) => {
   res.send("Welcome to Money multiplier world")
})









var Port = process.env.PORT || 3001;
app.listen(Port, (err) => {
   if (err) {
      console.log(err)
   } else {
      console.log('Server is listening' + ' ' + Port);
      db
   }
});