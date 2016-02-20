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
// var passport = require('passport');
// var passportLocal = require('passport-local');
// passport.use(new passportLocal.Strategy(function(email, password, done) {
//     //check password in db
//     User.findOne({
//         where: {
//             email: email
//         }
//     }).then(function(user) {
//         //check password against hash
//         if(user){
//             bcrypt.compare(password, user.dataValues.password, function(err, user) {
//                 if (user) {
//                   //if password is correct authenticate the user with cookie
//                   done(null, { id: email, email: email });
//                 } else{
//                   done(null, null);
//                 }
//             });
//         } else {
//             done(null, null);
//         }
//     });

// }));


//middleware init
app.use(require('express-session')({
    secret: 'eekamouse',
    resave: true,
    saveUninitialized: true,
    cookie : { secure : false, maxAge : (4 * 60 * 60 * 1000) }, // 4 hours
}));


var checkUser = function(email, password){
  User.findOne({
    where: {
      email: email,
    }
  }).then(function(results){
    bcrypt.compare(password, results.dataValues.password, function(err, results){
      console.log("Results are " + results);
      if(results){
       
        console.log("Successfully logged in!");
        res.redirect("/loggedIn");
      } else {
        console.log("Your login credentials do not work");
      }
    })
  }).catch(function(err){
    console.log("Database error");
  })
}












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

router.post('/signIn', function(req, res){
  var email= req.body.email;
  var password = req.body.password;
  var checkUser = function(email, password){
    console.log ("function works")
  User.findOne({
    where: {
      email: email,
    }
  }).then(function(results){
    bcrypt.compare(password, results.dataValues.password, function(err, results){
      console.log("Results are " + results);
      if(results){
       
        console.log("Successfully logged in!");
        res.redirect("/loggedIn");
      } else {
        console.log("Your login credentials do not work");
      }
    })
  }).catch(function(err){
    console.log("Database error");
  })
}
  checkUser(email, password)
});

router.get('/loggedIn', function(req,res) {
  res.send("You have logged in!  Good for you!");
});


router.get('/students', function(req,res) {
  res.render("students");
});

router.get('/instructors', function(req,res) {
  res.render("instructors");
});

module.exports = router;

