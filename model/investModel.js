const mongoose = require('mongoose');

const InvestModelSchema = new mongoose.Schema(
   {
      userId: {
         type: mongoose.Schema.Types.ObjectId
      },
      investId: {
         type: mongoose.Schema.Types.ObjectId
      },
      investPrice: {
         type: String,
      },
      profitPerHour: {
         type: String,
      },
      durationOfInvest: {
         type: String,
      },
      purhaseTime: {
         type: String,
      },
      expireTime: {
         type: String,
      },
      accEarning: {
         type: String,
         default: "0",
      },
   }
);

module.exports = mongoose.model('InvestModel', InvestModelSchema);
