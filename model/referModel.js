const mongoose = require('mongoose')

const ReferModelSchema = new mongoose.Schema(
   {
      userId: {
         type: String,
      },
      refCode: {
         type: String,
      }
   }
);

module.exports = mongoose.model('ReferModel', ReferModelSchema);
