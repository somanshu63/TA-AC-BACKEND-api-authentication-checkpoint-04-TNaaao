var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var slug = require('slug');

var questionSchema = new Schema({
    tags: [String],
    answers: [{type: Schema.Types.ObjectId, ref:'Answer'}],
    title: {type: String, required: true, unique: true},
    author: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    description: String,
    upvotes: Number,
    comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
    slug: String,
}, {timestamps: true});


questionSchema.pre('save', async function(next) {
    if(this.title && this.isModified('title')){
        this.slug = slug(this.title);
    }
    next();
})


questionSchema.methods.qJSON = async function () {
    return{
        tags: this.tags,
        answers: this.answers,
        id: this.id,
        title: this.title,
        description: this.description,
        author: this.author,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        slug: this.slug,
        __V: this.__v
    }
}

module.exports = mongoose.model('Question', questionSchema);