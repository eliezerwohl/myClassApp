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

router.post('/register', function(req,res) {
  res.render("index", req.body);
});

router.get('/students', function(req,res) {
  res.render("students");
});

router.get('/instructors', function(req,res) {
  res.render("instructors");
});

module.exports = router;

// sequelize.sync().then(function(){
  app.listen(PORT, function() {
    console.log("Listening on port %s", PORT);
  })
// });