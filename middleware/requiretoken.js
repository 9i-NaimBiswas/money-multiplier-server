const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../model/userscema');
const key = process.env.SECRET_KEY;
module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).send({ error: 'you must be logged in.' });
  }
  const token = authorization.replace('Bearer ', '');
  jwt.verify(token, key, async (err, paylod) => {
    if (err) {
      res.status(401).send({ error: 'you must be logged in 2' });
    }
    const { userId } = paylod;
    const user = await User.findById(userId);
    req.user = user;
    next();
  });
};
