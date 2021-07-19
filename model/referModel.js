const mongoose = require('mongoose')

const ReferModelSchema = new mongoose.Schema(
   {
      userId: {
         type: mongoose.Schema.Types.ObjectId,
      },
      refCode: {
         type: String,
      },
      totalPeople: {
         type: Number,
         default: 0,
      },
      referWith: {
         type: mongoose.Schema.Types.ObjectId,
      }
   }
);

module.exports = mongoose.model('ReferModel', ReferModelSchema);
