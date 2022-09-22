var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var answerSchema = new Schema({
    text: {type: String, required: true},
    author: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
    upvotes: Number,
    comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
    questionId: {type: Schema.Types.ObjectId, ref:'Question'}
}, {timestamps: true});

answerSchema.methods.aJSON = async function () {
    return {
        _id: this.id,
        text: this.text,
        author: this.author,
        questionId: this.questionId,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt
    }
}

module.exports = mongoose.model('Answer', answerSchema);