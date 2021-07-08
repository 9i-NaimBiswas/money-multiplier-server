const express = require('express')
const Router = express.Router()
const investModel = require('../model/investModel')
// buy a investment 
Router.post('/buy-investment', (req, res) => {
   const userId = req.headers['userid']
   const investId = req.headers['investid']

   const { investPrice, profitPerHour, durationOfInvest, purhaseTime, expireTime } = req.body

   if (userId && investPrice && profitPerHour && purhaseTime && expireTime) {
      const newInvest = new investModel({
         userId: userId,
         investId: investId,
         investPrice: investPrice,
         profitPerHour: profitPerHour,
         durationOfInvest: durationOfInvest,
         purhaseTime: purhaseTime,
         expireTime: expireTime,
      })
      newInvest.save().then(data => {
         res.status(200).json({
            message: "Thanks for buying a investment service",
            success: true,
            data: data
         })
      })
   } else {
      res.status(400).json({
         message: "Fill all the fileds and send again",
         success: false,
         requiredFields: ["userid , investPrice , profitPerHour , durationOfInvest , purhaseTime , expireTime", "send userid by headers", "Check all the fields values"],
      })
   }
})

// get all investment 
Router.get('/get-investment-details', (req, res) => {
   const userId = req.headers['userid']
   investModel.find({ userId: userId }).then(data => {
      res.status(200).json({
         message: "All invest ment history",
         success: true,
         data: data
      })
   }).catch(err => {
      res.status(500).json({
         message: "Some thing went wrong",
         success: false,
         err: err,
      })
   })
})


module.exports = Router