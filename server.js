var express = require("express");
var app = express();
var PORT = 8080;

var expressHandlebars = require("express-handlebars")
app.engine('handlebars', expressHandlebars({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))

var routes = require('./controllers/classController.js');
app.use('/', routes);
app.use('/register', routes);
app.use('/students', routes);
app.use('/saveRegister', routes);
app.use('/signIn', routes);
app.use('/loggedIn', routes);
app.use('/studentAdd', routes);


// sequelize.sync().then(function(){
  app.listen(PORT, function() {
    console.log("Listening on port %s", PORT);
  })
// });
