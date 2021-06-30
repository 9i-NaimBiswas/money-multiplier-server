const express = require('express');
const app = express();
const db = require("./db/conn")

const dotenv = require('dotenv');
const bodyParser = require("body-parser")
const cors = require('cors')


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






const PORT = 3001 || process.env.PORT;


app.listen(PORT, () => {
   console.log(`server running at port no. ${PORT}`);
   db
});
