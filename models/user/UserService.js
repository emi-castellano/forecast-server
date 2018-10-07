var UserSchema = require('./UserSchema')
var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/forecast')

class UserService {
    constructor() {
        
        this.userSchema = new UserSchema()
    }

    async checkIfUserExists(username)  {
        return await this.getUser(username)
        
    }

    getUser(username) {
        const data = this.userSchema.findOne({ username: 'emilianoc' }, function(err, user) {
            if (err) return err
        });
        console.log(data)
        return data
        /*return this.userSchema.findOne({ username: username }, 'username', function (err, user) {
            if (err) return err
        })*/
    }
}

module.exports = UserService