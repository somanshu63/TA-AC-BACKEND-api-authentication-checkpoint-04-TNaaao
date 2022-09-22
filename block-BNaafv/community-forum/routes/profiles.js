var express = require('express');
var router = express.Router();
var User = require('../models/user');
var auth = require('../middlewares/auth');

//profile information
router.get('/:username', auth.optional, async (req, res, next) => {
    var username = req.params.username;
    try {
        var user = await User.findOne({ username });
        res.status(200).json({user: await user.profile()});
    } catch (error) {
        next(error);        
    }
});

//update profile
router.put('/:username', auth.verifyToken, async (req, res, next )=> {
    var username = req.params.username;
    try {
        var user = await User.findOneAndUpdate({ username }, req.body, {new:true});
        if(!user){
            return res.status(400).json({error: 'no user by this username'});
        }
        res.status(200).json({user: await user.profile()});
    } catch (error) {
        next(error);
    }
});


module.exports = router;
