var express = require('express');
var app = express();
var router = express.Router();

router.get('/', function(req,res) {
  res.render("index");
});

router.get('/register', function(req,res) {
  res.render("register");
});

router.get('/students', function(req,res) {
  res.render("students");
});

router.get('/instructors', function(req,res) {
  res.render("instructors");
});

module.exports = router;

