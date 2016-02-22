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
var Students = sequelize.define('Students', {
  firstName: Sequelize.STRING,
  // lastname: Sequelize.STRING
});

var Teachers = sequelize.define('Teachers', {
  firstName: Sequelize.STRING,
  // lastName:Sequelize.STRING,
  // ta:Sequelize.BOOLEAN
});

var TA = sequelize.define('TA', {
  firstName: Sequelize.STRING,
  // lastName:Sequelize.STRING,
  // ta:Sequelize.BOOLEAN
});

Teachers.hasMany(Students);
Teachers.hasMany(TA);


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
  Teachers.findAll({
    include: [
      {model:Students},
      {model:TA}
    ]
  }).then(function(Teachers) {
    res.render('students', {
      Teachers: Teachers
    })
  });
});

router.post('/studentAdd', function(req, res) {
  Students.create(req.body).then(function() {
    res.redirect('/students');
  });
});


router.get('/instructors', function(req,res) {
  res.render("instructors");
});

module.exports = router;

// sequelize.sync().then(function(){
//   app.listen(PORT, function() {
//     console.log("Listening on port %s", PORT);
//   })
// });
