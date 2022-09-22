var express = require('express');
var router = express.Router();
var User = require('../models/user');
var auth = require('../middlewares/auth')
var Question = require('../models/question');


//register user
router.post('/', async (req, res, next) => {
    req.body.isAdmin = true;
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
    if(!user.isAdmin){
        res.status(400).json({error: 'you are not admin login through user router'});
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


//block user
router.post('/:username/block', auth.verifyAdmin, async (req, res, next) => {
    var username = req.params.username;
    try {
        var user = await User.findOneAndUpdate({username}, {$set: {isBlocked: true}}, {new:true});
        res.status(200).json({user: user});
    } catch (error) {
        next(error);
    }
});

//unblock user
router.delete('/:username/block', auth.verifyAdmin, async (req, res, next) => {
    var username = req.params.username;
    try {
        var user = await User.findOneAndUpdate({username}, {$set: {isBlocked: false}}, {new:true});
        res.status(200).json({user: user});
    } catch (error) {
        next(error);
    }
});


//questions
router.get('/questions', auth.verifyAdmin, async (req, res, next) => {
  try {
    var questions = await Question.find({}).populate('author comments answers', 'id username body text');
    res.status(200).json({questions: questions});
  } catch (error) {
    
  }
});


//user
router.get('/users', auth.verifyAdmin, async (req, res, next) => {
    try {
        var user = await User.find({});
        res.status(200).json({user: user});
    } catch (error) {
        next(error);
    }
});









module.exports = router;