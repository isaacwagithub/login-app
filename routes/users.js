var express = require('express');
var router = express.Router();
var passport = require('passport');
var db = require('../db');
var bcrypt = require('bcrypt');
const saltRounds = 10;

/* GET Guest Page. */
router.get('/', function(req, res) {  
  res.render('homepage');
});

/* Login post. */
router.post('/login',passport.authenticate('local'));
router.post('/register', function(req, res, next) {
  //validation
  req.checkBody('name','Name is required').notEmpty();
  req.checkBody('email','Email is required').notEmpty();
  req.checkBody('email','Email is not valid').isEmail();
  req.checkBody('password','Password is required').notEmpty();
  req.checkBody('password2','Passwords do not match').equals(req.body.password);
  
  const errors = req.validationErrors();
  if(errors){
	  console.log(errors);
	  res.render('register',{
		  title: 'Registration Error',
		  errors:errors
	  });
  }else{
	  const name = req.body.name;
	  const username = req.body.username;
	  const email = req.body.email;
	  const password = req.body.password;
	  const password2 = req.body.password2;
	  
	  bcrypt.hash(password,saltRounds,function(error,hash){
	  //inserting new user to the database
		db.query('insert into users (name,username,email,password) value(?,?,?,?)',
		[name,username,email,hash],function(error,results,fields){
			if(error){
				console.log(error);
				//rendering register page to display the 'email is already in use' error
				res.render('register',{
				title:'Registration Error',
				error:'The email you provided is already in use'
			  });//end of rendering register page with errors
			}else{
				db.query('select last_insert_id() as user_id',function(error,results,fields){
					if(error) throw error;
					
					const user_id = results[0];
					
					console.log(results[0]);
					req.login(user_id,function(err){
						res.redirect('/');
					});//end of req.login
				});//end of db.query
			}//end of else  
		});//end of select last_insert_id() query    
	  });//end of bcrypt
  }//end of else	
});
//End of register router

//forgot password route
router.post('/forgot', function (req, res, next){
	//validation
	req.checkBody('email','Email is required').notEmpty();
	req.checkBody('email','Email is not valid').isEmail();
	
	const errors = req.validationErrors();
	if(errors){
		console.log(errors);
		res.render('forgot',{
			title: 'Error',
			errors: errors
		});
	}else{
		const email = req.body.email;
		//querying to see if email exists in the database
		db.query('select username from users where email = ?',
		[email],function(err, results, fields){
			if(err){done(err)};
			if(results.length==0){
				console.log('Email does not exist');
				res.render('forgot',{
					title: 'Reseting Password Error',
					error: 'No username exist with that email address'});
			}else{
				res.render('forgot',{title: 'Email was sent to you. Please go to your email to reset password'});
			}
		});
		
	}
});//end of forgot post route

//passport
passport.serializeUser(function(user_id,done){
	done(null,user_id);
});	  

passport.deserializeUser(function(user_id,done){
	done(null,user_id);
});

function authenticationMiddleware(){
	return (req, res, next) => {
		console.log('request.session.passport.user: ${JSON.stringify(req.session.passport)}');
			
			if(req.isAuthenticated()) return next(
			   );
			
			res.redirect('/login');	
	}
}

module.exports = router;
