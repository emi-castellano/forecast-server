var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var bcrypt = require('bcryptjs')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));

var port = process.env.PORT || 8080;

var UserModel = require('./models/user/UserSchema')

function getUser(username) {
    return UserModel.findOne({ username: username }, function (err, user) {
        if (err) return err
    })
}

function generateHash(value) {
    var salt = bcrypt.genSaltSync(10)
    return bcrypt.hashSync(value, salt)
}

async function signUp(req, res) {
    try {
        const { username, password, email, fullname } = req.body
        const exists = await getUser(username)

        if (!exists) {
            let userToSave = new UserModel()
            userToSave.username = username
            userToSave.email = email
            userToSave.password = generateHash(password)
            userToSave.fullname = fullname
            userToSave.token = generateHash(username + fullname)

            userToSave.save(err => {
                if (err) return res.status(404).send({ message: 'An error has ocurred while creating a user.' })
            })
            res.status(200).send({ token: userToSave.token })
        } else {
            res.status(404).send({ message: 'The user already exists.' })
        }
    } catch (err) {
        console.log(err)
    }
}

async function signIn(req, res) {
    try {
        const { username, password } = req.body
        const user = await getUser(username)

        const passwordChecked = bcrypt.compareSync(password, user.password);

        if (passwordChecked && username === user.username) {
            res.status(200).send({ token: user.token })
        } else {
            res.status(404).send({ message: 'Login failed, check your credentials.' })
        }
    } catch (err) {
        console.log(err)
    }
}

app.post('/sign-up', function(req, res) {
    signUp(req, res)
})

app.post('/sign-in', function(req, res){ 
    signIn(req, res)
})

mongoose.Promise = global.Promise

mongoose.connect('mongodb://localhost:27017/forecast')
    .then(() => {
        app.listen(port);
        console.log("Magic happens at 8080");
    }).catch((err) => {
        console.error(err);
    }); 