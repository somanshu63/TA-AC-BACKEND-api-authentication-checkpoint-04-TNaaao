var express = require('express');
var router = express.Router();
var User = require('../models/user');
var auth = require('../middlewares/auth');

//follow user
router.post('/:username/follow', auth.verifyToken, async (req, res, next) => {
    var username = req.params.username;
    try {
        var user = await User.findOneAndUpdate({username}, {$push: {followers: req.user.id}});
        if(!user){
            return res.status(400).json({error: 'no user exist'});
        }
        if(user.id == req.user.id){
            return res.status(400).json({error: "you can't follow yourself"});
        }
        res.status(200).json({user: user});
    } catch (error) {
        next(error);
    }
});

//unfollow user
router.delete('/:username/follow', auth.verifyToken, async (req, res, next) => {
    var username = req.params.username;
    try {
        var user = await User.findOneAndUpdate({username}, {$pull: {followers: req.user.id}});
        if(!user){
            return res.status(400).json({error: 'no user exist'});
        }
        if(user.id == req.user.id){
            return res.status(400).json({error: "you can't unfollow yourself"});
        }
        res.status(200).json({user: user});
    } catch (error) {
        next(error);
    }
});


module.exports = router;
