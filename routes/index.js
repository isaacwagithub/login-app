var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.user);
  console.log(req.isAuthenticated()); 		
  res.render('index');
});

/* GET registration page. */
router.get('/registration', function(req, res, next) {
  res.render('register', { title: 'Registration' });
});

/* GET login page. */
router.get('/login',function(req, res, next){
	res.render('login');
});

/* GET forgot password page. */
router.get('/forgot-password', function(req, res, next) {
  res.render('forgot', { title: 'Forgot Password' });
});
module.exports = router;
