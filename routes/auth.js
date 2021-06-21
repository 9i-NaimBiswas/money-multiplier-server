const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const messagebird = require('messagebird')('PZAOeqb1BaRTgscrNAoXTdFcA');

require('../db/conn');
const User = require('../model/userscema');
const requireToken = require('../middleware/requiretoken');

const client = require('twilio')(
  'ACa27adbce36a549f95fe63c64a636f42c',
  '84278d4e11967fe7a67330d69e6c9a37'
);

router.get('/', (req, res) => {
  res.send('welcome to money app API');
});

router.get('/sendotp', async (req, res) => {
  try {
    const userExists = await User.findOne({ phone: req.query.phonenumber });
    if (userExists) {
      client.verify
        .services('VAeeae7ea43e866903bda198c9a148edde')
        .verifications.create({
          to: `+${req.query.phonenumber}`,
          channel: req.query.channel,
        })
        .then((data) => {
          res.status(200).send(data);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  } catch (error) {
    res.send(error);
  }
});

router.get('/verify', async (req, res) => {
  try {
    const userExists = await User.findOne({ phone: req.query.phonenumber });
    if (userExists) {
      client.verify
        .services('VAeeae7ea43e866903bda198c9a148edde')
        .verificationChecks.create({
          to: `+${req.query.phonenumber}`,
          code: req.query.code,
        })
        .then(res.status(200).send(userExists._id));
      // .then(res.send(userExists._id));
    } else {
      res.status(400).send('nummber not found');
    }
  } catch (error) {
    res.send(error);
  }
});

router.get('/test', async (req, res) => {
  const userid = req.headers['user'];
  User.findOne({ _id: userid }, function (err, result) {
    if (err) {
      res.send(err);
    } else {
      res.json({ data: result });
    }
  });
});
// // send otp
// router.post('/otp', (req, res) => {
//   const { phoneNumber } = req.body;
//   if (!phoneNumber) {
//     res.status(422).json({
//       message: 'Validation Error, ',
//       error: 'Phone Number is required',
//       success: false,
//     });
//   } else {
//     const newPhoneNumber = '+88' + phoneNumber;

//     messagebird.verify.create(
//       newPhoneNumber,
//       {
//         emplate: 'Your Verify Code is %token',
//         timeout: 120,
//       },
//       function (err, response) {
//         if (err) {
//           res.status(400).json({
//             message: 'Something went wrong',
//             error: err,
//             success: false,
//           });
//         } else {
//           res.status(200).json({
//             message: 'Otp Sended',
//             response: response,
//             success: true,
//           });
//         }
//       }
//     );
//   }
// });

// /////send otp using Twillio//////

// router.route('/').get(function (req, res) {
//   const { user } = req.body;
//  );
// });

// using promises

// router.post('/register', (req, res) => {
//   const { name, phone, email, work, password, cpassword } = req.body;

//   if (!name || !phone || !email || !work || !password || !cpassword) {
//     return res.status(422).json({ error: 'plz fill the field' });
//   }
//   User.findOne({ email: email })
//     .then((userExists) => {
//       if (userExists) {
//         return res.status(422).json({ error: 'email already taken' });
//       }
//       const user = new User({ name, phone, email, work, password, cpassword });

//       user
//         .save()
//         .then(() => {
//           res.status(201).json({ message: 'User created' });
//         })
//         .catch((err) => {
//           res.status(500).json({ error: err });
//         });
//     })
//     .catch((err) => console.log(err));
// });

router.post('/register', async (req, res) => {
  const { phone, email, password, cpassword, reedemCode } = req.body;

  if (!phone || !email || !password || !cpassword) {
    return res.status(422).json({ error: 'plz fill the field' });
  }

  try {
    const userExists = await User.findOne({ email: email });
    if (userExists) {
      return res.status(422).json({ error: 'email already taken' });
    } else if (password != cpassword) {
      return res.status(422).json({ error: 'password not matched' });
    } else {
      const user = new User({ phone, email, password, cpassword, reedemCode });

      await user.save();
      const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY);
      res.status(201).json({ token });
    }
  } catch (error) {
    console.log(error);
  }
});

// login route

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.json({ error: 'plz fill credentials' });
    }
    const userLogin = await User.findOne({ email: email });
    if (userLogin) {
      const ismatched = await bcrypt.compare(password, userLogin.password);
      const token = await userLogin.generateAuthToken();

      res.cookie('jwtoken', token, {
        expires: new Date(Date.now() + 25892000000),
        httpOnly: true,
      });

      if (!ismatched) {
        res.status(400).json({ error: 'invalid credentials' });
      } else {
        const token = jwt.sign(
          { userId: userLogin._id },
          process.env.SECRET_KEY
        );
        res.json({ message: { userId: userLogin._id, token: token } });
      }
    } else {
      res.status(400).json({ error: 'invalid credentials' });
    }
  } catch (error) {
    return res.status(422).send(error.message);
  }
});

router.get('/balance', (req, res, next) => {
  let user = req.user;
  return res.send(user);
});

module.exports = router;
