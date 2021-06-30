const express = require("express")
const Router = express.Router()


Router.post('/bank-details', (req, res) => {
   const userId = req.headers['userid']
   const { name, email, mobile, bankAccount, bankName, ifseCode, upiCode } = req.body
   if (!name || !email || !mobile || !bankAccount || !bankName || !ifseCode || !upiCode) {
      res.send("hello")
   } else {
      res.status(400).json({
         message: "Fill all the fileds and try again",
         success: false,
      })
   }

})
module.exports = Router