var express = require('express');
var fs = require('fs');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var hbs = require('express-handlebars');
const nodemailer = require('nodemailer');

//Authentication packages
var session = require('express-session');
var passport = require('passport');
var MySQLStore = require('express-mysql-session')(session); 

// Routes
var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.engine('hbs',hbs({extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
var options = {
	host: 'localhost',
	user: 'root',
	password: 'rootaccount',
	database: 'userlogin'
};
var sessionStore = new MySQLStore(options);

app.use(session({
	secret: 'cats and dogs',
	resave: false,
	store: sessionStore,
	saveUninitialized: true,
	//cookie: {secure:true}
}));
//nodemailer
let transporter = nodemailer.createTransport({
	service: 'gmail',
	secure: false,
	port: 25,
	auth:{
		user:'testingNode@gmail.com',
		password: 'password',
	},
	tls: {
		rejectUnauthorized: false
	}
});

let HelperOptions = {
	from: '"isaacwagithub" <testingNode@gmail.com>',
	to: 'imokoena268@gmail.com',
	subject: 'Hello From Nodemailer',
	text: 'Wow this tutorial is amazing'	
};

transporter.sendMail(HelperOptions, function(error, info){
	if(error){
		console.log(error);
	}else{
		console.log('The email was sent successfully');
		console.log(info);
	}
});
// passport
app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
