require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

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
    password: String,
    secret: String
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

app.get('/submit', function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: username })
        .then(function (foundUser, err) {
            if (foundUser) {
                res.render('submit');
            } else {
                console.log(err);
            }
        })
})

app.get("/logout", function (req, res, next) {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
});

app.post('/register', function (req, res) {

    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
        const newUser = new User({
            email: req.body.username,
            password: hash
        });
        const registerSuccess = newUser.save();
        if (registerSuccess) {
            res.render('secrets');
        } else {
            console.log('register failed');
        }
    })


});

app.post('/login', function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: username })
        .then(function (foundUser, err) {
            if (err) {
                console.log(err);
            } else {
                if (foundUser) {
                    bcrypt.compare(password, foundUser.password, function (err, result) {
                        if (result === true) {
                            res.render('secrets');
                        }
                    });
                }
            }
        })
})

app.post("/submit", function (req, res) {
    const submittedSecret = req.body.secret;
    // i need to fix the id search because it doesnt work
    User.findById(_id = req.newUser.id)
        .then(function (err, foundUser) {
            if (err) {
                console.log(err);
            } else {
                foundUser.secret == submittedSecret;
                foundUser.save()
                    .then(function (err) {
                        if (!err) {
                            res.redirect('/secrets');
                        } else {
                            console.log(err);
                        }
                    })
            }
        });
});





app.listen(3000, function (req, res) {
    console.log('server up and running on port 3000');
})

