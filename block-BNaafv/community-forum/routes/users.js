var express = require('express');
const jwt = require('jsonwebtoken');
var router = express.Router();
var User = require('../models/user');
var auth = require('../middlewares/auth');

//register user
router.post('/', async (req, res, next) => {
  try {
    var user = await User.create(req.body);
    var token = await user.signToken();
    res.status(200).json({user: await user.userJSON(token)});
  } catch (error) {
    next(error);
  }
});

//login user
router.post('/login', async (req, res, next) => {
  var {email, password} = req.body;
  if(!email || !password){
    res.status(400).json({error: 'email/password required'});
  }
  var user = await User.findOne({ email });
  if(!user){
    res.status(400).json({error: 'email not registered'});
  }
  var result = await user.verifyPassword(password);
  if(!result){
    res.status(400).json({error: 'wrong password'});
  }
  try {
    var token = await user.signToken();
    res.status(200).json({user: await user.userJSON(token)});
  } catch (error) {
    next(error)
  }
});

//current user
router.get('/current-user', auth.verifyToken, async (req, res, next) => {
  try {
    var user = await User.findOne({ email: req.user.email });
    var token = await user.signToken();
    res.status(200).json({user: await user.userJSON(token)});
  } catch (error) {
    
  }
});




module.exports = router;
