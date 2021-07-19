const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');

const User = require('../model/userscema');
const ReferModel = require('../model/referModel');


const multer = require("multer")
const storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, './uploads/')
   },
   filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname)
   }
})

const upload = multer({ storage: storage })





const SERVICE_ID = "VA25e2f12a0ae7b959a4fd1112e185a8af"
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
router.post('/register', (req, res) => {
   const { phone, email, password, cpassword, reedemCode } = req.body;

   if (!phone || !email || !password || !cpassword) {
      return res.status(422).json({ error: 'Please fill all fields' });
   }
   const userExists = User.findOne({ email: email }, (err, userExists) => {

      if (userExists) {
         return res.status(422).json({
            error: 'Email a user exits with this email, try again with another mail',
            userId: userExists._id,
            email: userExists.email,
            phoneNumber: userExists.phone
         });
      } else if (password != cpassword) {
         return res.status(422).json({
            error: 'Password and confirm password must be same'
         });
      } else {
         if (reedemCode) {
            ReferModel.findOne({ refCode: reedemCode }, (err, Codedata) => {
               if (Codedata) {
                  const user = new User({
                     phone: phone,
                     email: email,
                     password: password,
                     cpassword: cpassword,
                     reedemCode: reedemCode,
                     referUse: true,
                  });
                  user.save().then(data => {
                     res.status(201).json({
                        messag: "Registration success",
                        success: true,
                        newUser: true,
                        userId: data._id
                     });
                  })
               } else {
                  res.status(400).json({
                     messag: "Wrong Reedeme code, Please try agian with valid code",
                     success: false,
                     error: err,
                  });
               }
            })
         } else {
            res.status(400).json({
               messag: "Wrong Reede code, Please try agian with valid code",
               success: false,
            });
         }
      }
   });
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

// delete a user 
router.delete("/delete-user", (req, res) => {
   const userId = req.headers['userid'];
   if (userId) {
      User.findOneAndDelete({ _id: userId }, function (err, result) {
         if (err) {
            res.status(400).json({ message: "Something went wrong", success: false, error: err });
         } else {
            res.status(200).json({ message: "User Deleted success", success: true, });
         }
      });
   } else {
      res.status(400).json({
         message: "Send userid by headers",
         success: false,
      })
   }

})




// update profile image 
router.put('/update-profile', upload.single("image"), (req, res) => {
   const userId = req.headers['userid']
   if (userId) {
      if (req.file) {
         User.findByIdAndUpdate(userId, { image: req.file.path }, { new: true }, (err, successData) => {
            if (err) {
               res.status(500).json({
                  message: "Something went wrong",
                  success: false,
                  error: err
               })
            } else {
               res.status(202).json({
                  message: "Image updated success",
                  success: true,
                  data: successData
               })
            }
         })
      } else {
         res.status(400).json({
            message: "Select a image and try agian later",
            success: false,
         })
      }
   } else {
      res.status(400).json({
         message: "Send userid by headers",
         success: false,
      })
   }

})

module.exports = router;
