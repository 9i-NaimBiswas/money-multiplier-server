const Router = require('express').Router()
const UserModel = require('../model/userscema')
const referModel = require('../model/referModel')
const totalPeopleValidate = require('../validation/totalPeopleValidate')
Router.get('/total-people', (req, res) => {
   const userId = req.headers['userid']
   if (userId) {
      referModel.findOne({ userId: userId }, (err, data) => {
         if (data) {
            res.status(200).json({
               message: "Total refer user",
               success: true,
               total: data.totalPeople,
            })
         }
      })
   } else {
      res.status(400).json({
         message: "userid is required",
         success: false,
      })
   }
})


Router.put('/reedem-people', (req, res) => {
   const userId = req.headers['userid']
   const { price, totalRemoved } = req.body

   const validate = totalPeopleValidate({ userId, price, totalRemoved })
   if (validate.isValid) {
      // find user by id 
      referModel.findOne({ userId: userId }, (err, data) => {
         //   if data 
         if (data) {
            const total = data.totalPeople
            // remove total people 
            const reduce = parseInt(total) - parseInt(totalRemoved)
            // update it 
            referModel.findOneAndUpdate({ userId: userId }, {
               totalPeople: reduce,
            }).then(succData => {
               // if success update balance in data 
               UserModel.findById(userId, (err, userData) => {
                  const UserBalance = userData.balance
                  const UserBalanceTotal = userData.totalIncome

                  const currentBalance = parseInt(UserBalance) + parseInt(price)
                  const currentBalanceTotal = parseInt(UserBalanceTotal) + parseInt(price)

                  UserModel.findByIdAndUpdate(userId, {
                     balance: currentBalance,
                     totalIncome: currentBalanceTotal
                  }, { new: true }).then(updateData => {
                     res.status(200).json({
                        message: "Thanks for reedem ",
                        success: true,
                        data: updateData,
                     })
                  })

               })
            })
         }
      })
   } else {
      res.status(400).json({
         message: "Incomplete details",
         success: false,
         error: validate.error,
      })
   }

})



module.exports = Router