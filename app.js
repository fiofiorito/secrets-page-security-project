require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const md5 = require('md5');

const app = express();
main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb+srv://' + process.env.DB_USER + ':' + process.env.DB_PASS + '@cluster0.tnikmz0.mongodb.net/SecretspageDB');
}

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


const User = new mongoose.model('User', userSchema);


app.get('/', function (req, res) {
    res.render('home');
});

app.get('/login', function (req, res) {
    res.render('login');
});

app.get('/register', function (req, res) {
    res.render('register');
});

app.post('/register', function (req, res) {
    const newUser = new User({
        email: req.body.username,
        password: md5(req.body.password)
    });
    const registerSuccess = newUser.save();
    if (registerSuccess) {
        res.render('secrets');
    } else {
        console.log('register failed');
    }

});

app.post('/login', function (req, res) {
    const username = req.body.username;
    const password = md5(req.body.password);

    User.findOne({ email: username })
        .then(function (foundUser, err) {
            if (err) {
                console.log(err);
            } else {
                if (foundUser.password === password) {
                    res.render('secrets');
                }
            }
        })
})






app.listen(3000, function (req, res) {
    console.log('server up and running on port 3000');
})

