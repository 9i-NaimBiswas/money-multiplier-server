const mongoose = require('mongoose');



// Connect MongoDB at default port 27017.
mongoose.connect('mongodb+srv://admin:admin@cluster0.gjgj2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
   useNewUrlParser: true,
   useCreateIndex: true,
   useUnifiedTopology: true,
   useFindAndModify: false,
}, (err) => {
   if (!err) {
      console.log('MongoDB Connection Succeeded...............')
   } else {
      console.log('Error in DB connection: ' + err)
   }
});
