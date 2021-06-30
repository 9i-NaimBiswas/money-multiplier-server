const mongoose = require('mongoose')

const BankModelSchema = new mongoose.Schema(
   {
      name: {
         type: String,
      },
      email: {
         type: String,
      },
      mobile: {
         type: String,
      },
      bankAccount: {
         type: String,
      },
      bankName: {
         type: String,
      },
      ifseCode: {
         type: String,
      },
      upiCode: {
         type: String,
      },
      userId: {
         type: mongoose.Schema.Types.ObjectId
      }

   }
);

module.exports = mongoose.model('BankModel', BankModelSchema);
