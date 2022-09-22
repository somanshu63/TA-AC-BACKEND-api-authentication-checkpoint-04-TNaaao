var express = require('express');
var router = express.Router();
var auth = require('../middlewares/auth');
const Answer = require('../models/answer');
var Question = require('../models/question');
var Comment = require('../models/comment');




//create question
router.post('/', auth.verifyToken, async (req, res, next) => {
    req.body.author = req.user.id;
    try {
        var question = await Question.findOne({title: req.body.title});
        if(question){
            return res.status(400).json({error: 'question already exist'});
        }
        var question = await (await (await Question.create(req.body)).populate('author', 'id, username'));
        res.status(200).json({question: await question.qJSON()});
    } catch (error) {
        next(error);
    }
});


//list question
router.get('/', auth.optional, (req, res, next) => {
    var array = [];
    try {
        Question.find({}).populate('author', 'id, name').exec((err, questions) => {
            async function data() {
                for (let i = 0; i < questions.length; i++) {
                    array[i] = await questions[i].qJSON();
                    if(i == questions.length - 1){
                        res.json({questions: array})
                    }
                }
            }
            data();
        });
    } catch (error) {
        next(error);
    }
});


//update question
router.put('/:questionsId', auth.verifyToken, async (req, res, next) => {
    var id = req.params.questionsId;
    var {description, title, tags} = req.body;
    try {
        var question = await Question.findById(id);
        if(!question){
            res.status(400).json({error: 'no question'})
        }
        question.title = title;
        question.description = description;
        question.tags = tags;
        question.save();
        res.status(200).json({updatedQuestion: await question.qJSON()});
    } catch (error) {
        next(error);
    }
})

//delete question
router.delete('/:slug', auth.verifyToken, async (req, res, next) => {
    var slug = req.params.slug;
    try {
        var question = await Question.findOneAndDelete({ slug });
        if(!question){
            return res.status(400).json({error: 'no question of this slug'});
        }
        res.status(200).json({deletedQuestion: await question.qJSON()});
    } catch (error) {
        next(error);
    }
});


//add answer
router.post('/:questionId/answers', auth.verifyToken, async (req, res, next) => {
    var id = req.params.questionId;
    req.body.author = req.user.id;
    req.body.questionId = id;
    try {
        var answer = await (await Answer.create(req.body)).populate('author', 'id, username');
        var question = await Question.findByIdAndUpdate(id, {$push: {answers: answer.id}});
        res.status(200).json({answer: await answer.aJSON()});
    } catch (error) {
        
    }
});

//list answers
router.get('/:questionId/answers', auth.verifyToken, async (req, res, next) => {
    var id = req.params.questionId;
    var array = [];
    try {
        var answers = await Answer.find({questionId: id}).populate('author', 'id, username');
        if(!answers){
            return res.status(400).json({error: 'no answers for this question'});
        }
        for (let i = 0; i < answers.length; i++) {
            array[i] = await answers[i].aJSON();
            if(i == answers.length - 1){
                res.json({answers: array})
            }
        }

    } catch (error) {
        next(error);
    }
});

//add upvote
router.post('/:questionId/upvote', auth.verifyToken, async (req, res, next) => {
    var id = req.params.questionId;
    try {
        var question = await Question.findByIdAndUpdate(id, {$inc: {upvotes: 1}}, {new:true}).populate('author answers', 'id, username');
        if(!question){
            return res.status(400).json({error: 'no questions exist for this id'});
        }
        res.status(200).json({question: question});
    } catch (error) {
        next();
    }
})

//add comment
router.post('/:questionId/comments', auth.verifyToken, async (req, res, next) => {
    var id = req.params.questionId;
    req.body.questionId = id;
    try {
        var comment = await Comment.create(req.body);
        var question = await Question.findByIdAndUpdate(id, {$push: {comments: comment.id}}, {new:true}).populate('comments author answers', 'body id username text');
        res.status(200).json({question: question})
    } catch (error) {
        next(error)
    }
});



module.exports = router;
