const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const userScema = new mongoose.Schema({
   email: {
      type: String,
      required: true,

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
   image: {
      type: String
   },
   balance: {
      type: Number,
      default: '0'
   },
   totalAssets: {
      type: Number,
      default: '0'
   },
   totalIncome: {
      type: Number,
      default: '0'
   },
   transactions: {
      type: Number,
      default: '0'
   },
   referUse: {
      type: Boolean,
      default: false,
   },


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
