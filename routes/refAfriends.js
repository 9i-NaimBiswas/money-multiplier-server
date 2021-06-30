const express = require("express")
const Router = express.Router()
const referralCodeGenerator = require('referral-code-generator')


Router.get('/refer-a-frields', (req, res) => {
   const refCode = referralCodeGenerator.alphaNumeric('uppercase', 8, 7)
   console.log(refCode)
})



module.exports = Router