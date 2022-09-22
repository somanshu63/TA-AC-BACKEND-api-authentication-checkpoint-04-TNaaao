var express = require('express');
var router = express.Router();
var Question = require('../models/question');

//list tags
router.get('/tags', function(req, res, next) {
  Question.distinct('tags').exec((err, tags) => {
    if(err) return next(err);
    res.status(200).json({tags: tags});
  });
});

module.exports = router;
