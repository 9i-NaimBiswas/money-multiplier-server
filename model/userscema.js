const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userScema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    // lowercase: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cpassword: {
    type: String,
    required: true,
  },
  reedemCode: {
    type: String,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
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
  console.log('hello from here');
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
    this.cpassword = await bcrypt.hash(this.cpassword, 12);
  }
  next();
});
// we are generating token

userScema.methods.generateAuthToken = async function () {
  try {
    let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    return token;
  } catch (error) {
    console.log(error);
  }
};

const User = mongoose.model('USER', userScema);

module.exports = User;
