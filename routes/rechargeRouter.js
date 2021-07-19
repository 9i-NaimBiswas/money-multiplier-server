const Router = require('express').Router()
const userModel = require('../model/userscema')
const referModel = require('../model/referModel')
Router.post("/recharge", (req, res) => {
   const { amount } = req.body
   const userId = req.headers['userid']

   if (amount && userId) {
      userModel.findOne({ _id: userId }, (err, data) => {
         if (data) {
            const newBalance = data.balance + parseInt(amount)
            const newTrans = data.transactions + parseInt(amount)

            userModel.findByIdAndUpdate(userId, {
               balance: newBalance,
               transactions: newTrans
            }, { new: true }, (err, data) => {
               const referCode = data.reedemCode
               referModel.findOne({ refCode: referCode }, (err, refData) => {


                  if (refData) {
                     const current = refData.totalPeople
                     const refUserId = refData._id
                     const SubTotal = parseInt(current) + 1



                     if (refData.referWith != userId) {
                        referModel.findByIdAndUpdate(refUserId, {
                           totalPeople: SubTotal,
                           referWith: userId
                        }, { new: true }).then(RefUpdateData => {
                           res.status(201).json({
                              message: "Thanks for recharge",
                              success: true,
                              data: data,
                              ReedemData: RefUpdateData
                           })
                        })
                     } else {
                        res.status(200).json({
                           message: "Thanks for recharge",
                           success: true,
                           data: data,
                        })
                     }
                  }
               })

            })
         }
      })
   } else {
      res.status(400).json({
         message: "Fill all the fileds and send again",
         success: false,
         requiredFields: ["userid , amount", "send userid by headers", "Check all the fields values"],
      })
   }
})






module.exports = Router