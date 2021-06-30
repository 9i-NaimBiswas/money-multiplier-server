const express = require("express")
const Router = express.Router()
const referralCodeGenerator = require('referral-code-generator')

const refFriendModel = require("../model/referModel")

Router.get('/refer-a-friends', (req, res) => {
   const refCodeFirst = referralCodeGenerator.alphaNumeric('lowercase', 1, 2)
   const refCodeSecond = referralCodeGenerator.alphaNumeric('lowercase', 1, 2)
   const refCode = refCodeFirst + refCodeSecond


   const userId = req.headers['userid']

   if (userId) {

      const check = refFriendModel.findOne({ userId: userId }, (err, data) => {
         if (data) {
            res.status(400).json({
               message: "User cann't make refer link two time!",
               success: false,
               refCode: data.refCode,
            })
         } else {
            const newRef = new refFriendModel({
               userId: userId,
               refCode: refCode
            })
            newRef.save().then(data => {
               res.status(201).json({
                  message: "Refer link generated",
                  success: true,
                  refCode: refCode
               })
            })
         }
      })


   } else {
      res.status(400).json({
         message: "Send userid by headers",
         success: false
      })
   }
})



module.exports = Router