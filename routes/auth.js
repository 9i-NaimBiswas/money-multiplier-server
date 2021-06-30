const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');

const User = require('../model/userscema');

const SERVICE_ID = "VA32e5cdce26645082c8d087d3e7995c1e"
require('../db/conn');


const client = require('twilio')('ACccc5f8b781334036e46ae03d777875ff', 'ccf28980f8f98ad9e69851766c733b98');



router.get('/sendotp', async (req, res) => {
   try {
      const userExists = User.findOne({ phone: req.headers['phonenumber'] });
      userExists.then(results => {

         if (!results) {
            client.verify
               .services(SERVICE_ID)
               .verifications.create({
                  to: `${req.headers['phonenumber']}`,
                  channel: 'sms',
               })
               .then((data) => {
                  res.status(200).json({
                     message: "Otp has been sended to user phone number",
                     success: true,
                     phoneNumber: req.headers['phonenumber']
                  });
               }).catch(err => {
                  res.status(400).json({
                     message: "Something  went wrong",
                     success: false,
                     error: err,
                  })
               })

         } else {
            res.status(400).json({
               message: "This phone number already registared",
               success: false,
               userExists: true,
            })
         }
      })

   } catch (error) {
      res.send(error);
   }
});

router.post('/verify', (req, res) => {

   const userExists = User.findOne({ phone: req.headers["phonenumber"] });

   userExists.then(data => {

      if (!data) {

         client.verify
            .services(SERVICE_ID)
            .verificationChecks.create({
               to: `${req.headers['phonenumber']}`,
               code: req.body.code,
            }).then(userExits => {
               res.status(200).json({
                  message: "Verification done",
                  success: true,
                  data: userExits
               })
            }).catch(err => {
               res.status(400).json({
                  message: "Verification failed",
                  success: false,
                  phoneNumber: req.headers['phonenumber'],
                  error: err
               })
            })

      } else {
         res.status(400).json({
            message: "This phone number already registared",
            success: false,
            userExists: true,
         })
      }

   })


});


router.get('/user-data', async (req, res) => {
   const userId = req.headers['userid'];
   if (userId) {
      User.findOne({ _id: userId }, function (err, result) {
         if (err) {
            res.status(400).json({ message: "Something went wrong", success: false, error: err });
         } else {
            res.status(200).json({ data: result });
         }
      });
   } else {
      res.status(400).json({
         message: "Send userid by headers",
         success: false,
      })
   }

});



// registration router s
router.post('/register', async (req, res) => {
   const { phone, email, password, cpassword, reedemCode } = req.body;

   if (!phone || !email || !password || !cpassword) {
      return res.status(422).json({ error: 'Please fill all fields' });
   }

   try {
      const userExists = await User.findOne({ email: email });
      if (userExists) {
         return res.status(422).json({ error: 'Email a user exits with this email, try again with another mail', userId: userExists._id, email: userExists.email, phoneNumber: userExists.phone });
      } else if (password != cpassword) {
         return res.status(422).json({ error: 'Password and confirm password must be same' });
      } else {
         const user = new User({ phone, email, password, cpassword, reedemCode });

         await user.save().then(data => {
            res.status(201).json({ messag: "Registration success", success: true, newUser: true, userId: data._id });

         })

      }
   } catch (error) {
      res.status(400).json({
         error: "Something went wrong",
         success: false,
         errMessage: error
      })
   }
});


// login route
router.post('/login', async (req, res, next) => {
   try {
      const { email, password } = req.body;
      if (!email || !password) {
         res.status(400).json({ error: 'Please fill credentials' });
      } else {
         const userLogin = await User.findOne({ email: email });
         if (userLogin) {
            const ismatched = await bcrypt.compare(password, userLogin.password);

            if (!ismatched) {
               res.status(400).json({ error: 'Invalid credentials', success: false, });
            } else {
               res.status(200).json({
                  message: "Login success",
                  success: true,
                  userId: userLogin._id,
                  email: userLogin.email,
                  phoneNumber: userLogin.phone,
               });
            }
         } else {
            res.status(400).json({ error: 'Invalid credentials' });
         }
      }

   } catch (error) {
      return res.status(422).send(error.message);
   }
});



module.exports = router;
