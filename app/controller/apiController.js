// require Node Dependencies
// var express = require('express');
// var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
var expresssession = require('express-session');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


// require Local modules
var setupModel = require('../models/setupModel');
var sendRegistrationEmail = require('./mailerController');
// var sendSMS = require('./smsController');

module.exports = function (app) {

	app.use( bodyParser.json() );
	app.use( bodyParser.urlencoded({ extended: true }) );
	var upload = multer({ dest: './public/uploads' });

	// Express Session
	app.use(expresssession({
		secret: 'secret',
		saveUninitialized: true,
		resave: true
	}));

	// Express Validator
	app.use(expressValidator({
	  errorFormatter: function(param, msg, value) {
	      var namespace = param.split('.')
	      , root    = namespace.shift()
	      , formParam = root;

	    while(namespace.length) {
	      formParam += '[' + namespace.shift() + ']';
	    }
	    return {
	      param : formParam,
	      msg   : msg,
	      value : value
	    };
	  }
	}));

	// Flash Messages
	app.use(flash());
	app.use(require('connect-flash')());
	app.use(function (req, res, next) {
	  res.locals.messages = require('express-messages')(req, res);
	  next();
	});
	app.use(passport.initialize());
  app.use(passport.session());

	// Home Page
	app.get('/', function (req, res) {
		setupModel.find(function (err, data) {
	 		if (err) {
	 			console.log(err);
	 		}

			res.render('pages/index', {
				Pagetitle: 'Home',
				data: data
			});
	 	});
 	});


 	// Portfolio Page
	app.get('/portfolio', function (req, res) {
		res.render('pages/portfolio', {
			Pagetitle: 'Portfolio'
		});
 	});

 	// Register Page
	app.get('/register', function (req, res) {
		setupModel.find(function (err, data) {
	 		if (err) {
	 			console.log(err);
	 		}

			res.render('pages/register', {
				Pagetitle: 'Register',
				errors: false
			});
	 	});
 	});

	// Save User's Data
	app.post('/user-registration', upload.single('picture'), function (req, res) {

		var name = req.body.name,
				email = req.body.email,
				password = req.body.password,
				phnNumber = req.body.number;

		req.check('name', 'Name is Required').notEmpty();
		req.check('email', 'Email is Required').notEmpty();
		req.check('email', 'Email is Not Valid ').isEmail();
		req.check('password', 'Password is Required').notEmpty();
		// req.check('phnNumber', 'Number is Not Valid').isInt();

		var errors = req.validationErrors();

		if (errors) {

			res.render('pages/register', {
				Pagetitle: 'Register',
				errors: errors,
				name: name,
				email: email,
				password: password,
				number: phnNumber,
			});
		} else {

			if ( req.file ) {
				// Profile Image Info
				var profileImage = req.file.filename;
			} else {
				var profileImage = 'profileImageDefault.png';
			}

			var usersData = {
				fullname: name,
				email: email,
				password: password,
				mobilenumber: phnNumber,
				profileimage: profileImage
			};

			var usersInfo = new setupModel(usersData);

			usersInfo.save( function (err, data) {
				if (err) {
					console.log(err);
				}

				if ( req.body.email ) {
					sendRegistrationEmail( req.body.email );
					// sendSMS();
				}
				req.flash('success', 'You have successfully Registered Please Login.');
				res.location('/main');
				res.redirect('/main');
			});
		}
	});

	// Login Page
	app.get('/login', function (req, res) {
		res.render('pages/login', {
			Pagetitle: 'Login'
 		});
	});

	passport.serializeUser(function(user, done) {
	  done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
	  setupModel.findById(id, function(err, user) {
	    done(err, user);
	  });
	});

	passport.use(new LocalStrategy({
		usernameField: 'email',
    passwordField: 'password'
  	}, function(username, password, done) {
	    setupModel.findOne({ email: username }, function (err, user) {
	      if (err) { return done(err); }
	      if (!user) {
	        return done(null, false, { message: 'Incorrect Email.' });
	      }
	      if (user.password != password) {
	      	return done(null, false, { message: 'Incorrect Password.' });
	      }
	      return done(null, user);
	    });
	  }
	));

	// Login Page
	app.post('/login',  passport.authenticate('local', { successRedirect: '/main',
		failureRedirect: '/login',
		failureFlash: true }));

	// Logout Page
	app.get('/logout', function (req, res) {
		req.logout();
		req.flash('success', 'You have successfully logged out.');

		res.render('pages/login', {
			Pagetitle: 'Login'
 		});
	});

	// Main Page
	app.get('/main', ensureAuthenticated , function (req, res) {
		res.render('pages/main', {
			Pagetitle: 'Main'
 		});
	});

	function ensureAuthenticated(req, res, done) {
		if (req.isAuthenticated()) {
			return done();
		}
		res.redirect('/login');
	};

	// Edit A User Info
	app.get('/edituser/:id', function (req, res) {
		setupModel.findById(req.params.id, function(err, data) {
			if(err) { console.log(err); }
			res.render('pages/edituser', {
				Pagetitle: 'Edit User',
				data: data
			});
		});
	});

	// Update A User Info
	app.post('/updateuser/:id', upload.single('picture'), function (req, res) {
		if ( req.file ) {
			// Profile Image Info
			var profileImage = req.file.filename;
		} else {
			var profileImage = 'profileImageDefault.png';
		}

		setupModel.findByIdAndUpdate(req.params.id,
			{
				$set: {
					fullname: req.body.name,
					email: req.body.email,
					password: req.body.password,
					mobilenumber: req.body.number,
					profileimage: profileImage
				}
			}, function(err, done) {
			if(err) { console.log(err); }
			req.flash('success', 'User Info Updated Successfully.');
    	res.redirect('/');
		});
	});

	// Delete A User
	app.get('/delete/:id', function(req, res) {
		setupModel.findByIdAndRemove(req.params.id, function(err, done){
    	if(err) { console.log(err); }
    	req.flash('success', 'User Successfully Deleted.');
    	res.redirect('/');
		});
	});

};