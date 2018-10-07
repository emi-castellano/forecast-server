var mongoose = require('mongoose')

var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    fullname: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true
    }
});
module.exports = mongoose.model('User', UserSchema)
