var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

var userSchema = new Schema({
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    name: String,
    image: String,
    bio: String,
    isAdmin: false,
    isBlocked: false,
    followers: [{type: Schema.Types.ObjectId}]
});

userSchema.pre('save', async function(next) {
    if(this.password && this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 10)
    }
    next();
});

userSchema.methods.verifyPassword = async function(password) {
    var result = await bcrypt.compare(password, this.password);
    return result;
}

userSchema.methods.signToken = async function() {
    var payload = {name: this.name, email: this.email, id: this.id, isAdmin: this.isAdmin}
    try {
        var token = await jwt.sign(payload, process.env.SECRET);
        return token;
    } catch (error) {
        return error;
    } 
}

userSchema.methods.userJSON = async function(token) {
    return {
        token: token,
        email: this.email,
        username: this.username
    }
}

userSchema.methods.profile = async function() {
    return {
        name: this.name,
        username: this.username,
        image: this.image,
        bio: this.bio
    }
}

module.exports = mongoose.model('User', userSchema)