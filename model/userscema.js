const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const userScema = new mongoose.Schema({
   email: {
      type: String,
      required: true,
      // lowercase: true,
   },
   phone: {
      type: Number,

   },
   password: {
      type: String,
      required: true,
   },

   reedemCode: {
      type: String,
   },

   // transactionsDone: {
   //   Balance: {
   //     type: Number,
   //     required: true,
   //   },
   //   TotalAssets: {
   //     type: Number,
   //     required: true,
   //   },
   //   TodaysIncome: {
   //     type: Number,
   //     required: true,
   //   },
   //   Transactions: {
   //     type: Number,
   //     required: true,
   //   },
   // },
});

userScema.pre('save', async function (next) {
   if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 12);

   }
   next();
});
// we are generating token



const User = mongoose.model('USER', userScema);

module.exports = User;
