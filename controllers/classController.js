var express = require('express');
var app = express();
var router = express.Router();
var bcrypt = require("bcryptjs");
var PORT = 8080;

var Sequelize = require('sequelize');
var sequelize = new Sequelize('myclassapp', 'root');


var User = sequelize.define('User', {
  email: {
    type: Sequelize.STRING,
    unique: true
  },
  password: Sequelize.STRING,
  firstname: Sequelize.STRING,
  lastname: Sequelize.STRING
}, {
  hooks: {
    beforeCreate: function(input){
      input.password = bcrypt.hashSync(input.password, 10);
    }
  }
});
var passport = require('passport');
var passportLocal = require('passport-local');
//middleware init
app.use(require('express-session')({
    secret: 'eekamouse',
    resave: true,
    saveUninitialized: true,
    cookie : { secure : false, maxAge : (4 * 60 * 60 * 1000) }, // 4 hours
}));
app.use(passport.initialize());
app.use(passport.session());



router.get('/', function(req,res) {
  res.render("index");
});

router.get('/register', function(req,res) {
  res.render("register");
});

router.post('/saveRegister', function(req,res) {
  User.create(req.body).then(function(result){
    res.redirect('/?msg=Account created');
  }).catch(function(err) {
    console.log(err);
    res.redirect('/?msg=' + err.errors[0].message);
  });
});

router.get('/students', function(req,res) {
  res.render("students");
});

router.get('/instructors', function(req,res) {
  res.render("instructors");
});

module.exports = router;

