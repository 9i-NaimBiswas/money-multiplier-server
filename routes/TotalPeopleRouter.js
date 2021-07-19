const Router = require('express').Router()
const UserModel = require('../model/userscema')
const referModel = require('../model/referModel')

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


Router.post('/update-total-people', (req, res) => {
   res.send("hello")
})



module.exports = Router