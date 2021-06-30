const express = require("express")
const Router = express.Router()
const bankModel = require("../model/bankModel")


// bank details added api
Router.post('/bank-details', (req, res) => {
   const userId = req.headers['userid']
   const { name, email, mobile, bankAccount, bankName, ifseCode, upiCode } = req.body
   if (!name || !email || !mobile || !bankAccount || !bankName || !ifseCode || !upiCode) {
      res.status(400).json({
         message: "Fill all the fileds and try again",
         success: false,
      })
   } else if (!userId) {
      res.status(400).json({
         message: "Send userid by headers",
         success: false,
      })
   } else {
      const newBank = new bankModel({
         userId: userId,
         name: name,
         email: email,
         mobile: mobile,
         bankAccount: bankAccount,
         bankName: bankName,
         ifseCode: ifseCode,
         upiCode: upiCode
      })
      newBank.save().then(data => {
         res.status(201).json({
            message: "Bank Details added",
            success: true,
            data: data
         })
      })
   }

})


Router.get("/get-bank-details", (req, res) => {
   const userId = req.headers['userid']

   bankModel.findOne({ userId: userId }, (err, data) => {
      if (err) {
         res.status(400).json({
            message: "Something happend wrong",
            success: false,
            error: err,
         })
      } else {
         res.status(200).json({
            message: "Bank details",
            success: true,
            data: data,
         })
      }
   })
})
module.exports = Router