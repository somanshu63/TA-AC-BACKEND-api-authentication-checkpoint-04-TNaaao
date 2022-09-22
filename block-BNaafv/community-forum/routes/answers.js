var express = require('express');
var router = express.Router();
var auth = require('../middlewares/auth');
var Answer = require('../models/answer');
const Question = require('../models/question');
const Comment = require('../models/comment');


//add upvote
router.post('/:answerId/upvote', auth.verifyToken, async (req, res, next) => {
    var id = req.params.answerId;
    try {
        var answer = await Answer.findByIdAndUpdate(id, {$inc: {upvotes: 1}}, {new:true}).populate('author questionId comments', 'id username title body');
        if(!answer){
            return res.status(400).json({error: 'no answers exist for this id'});
        }
        res.status(200).json({answer: answer});
    } catch (error) {
        next();
    }
})

//update answer
router.put('/:answerId', auth.verifyToken, async (req, res, next) => {
    var id = req.params.answerId;
    try {
        var answer = await Answer.findByIdAndUpdate(id, req.body, {new:true});
        if(!answer){
            return res.status(400).json({error: 'answer do not exist'});
        }
        res.status(200).json({answer: await answer.aJSON()});
    } catch (error) {
        next(error)
    }
});

//delete answer
router.delete('/:answerId', auth.verifyToken, async (req, res, next) => {
    var id = req.params.answerId;
    try {
        var answer = await Answer.findByIdAndDelete(id);
        if(!answer){
            return res.status(400).json({error: 'answer do not exist'});
        }
        var question = await Question.findByIdAndUpdate(answer.questionId, {$pull: {answers: id}});
        res.status(200).json({answer: await answer.aJSON()});
    } catch (error) {
        next(error);
    }
});




//add comment
router.post('/:answerId/comments', auth.verifyToken, async (req, res, next) => {
    var id = req.params.answerId;
    req.body.answerId = id;
    try {
        var comment = await Comment.create(req.body);
        var answer = await Answer.findByIdAndUpdate(id, {$push: {comments: comment.id}}, {new:true}).populate('comments author questionId', 'body id username title');
        res.status(200).json({answer: answer})
    } catch (error) {
        next(error)
    }
});



module.exports = router;
