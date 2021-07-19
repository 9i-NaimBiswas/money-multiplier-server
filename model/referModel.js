const mongoose = require('mongoose')

const ReferModelSchema = new mongoose.Schema(
   {
      userId: {
         type: String,
      },
      refCode: {
         type: String,
      },
      totalPeople: {
         type: Number,
         default: 0,
      }
   }
);

module.exports = mongoose.model('ReferModel', ReferModelSchema);
