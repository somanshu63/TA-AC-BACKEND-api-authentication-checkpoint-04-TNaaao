var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
    body: String,
    author: {type: Schema.Types.ObjectId, ref: 'User'},
    answerId: {type: Schema.Types.ObjectId, ref: 'Answer'},
    questionId: {type: Schema.Types.ObjectId, ref: 'User'}
}, {timestamps: true});

module.exports = mongoose.model('Comment', commentSchema);

