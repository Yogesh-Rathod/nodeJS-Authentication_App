// require Node Dependencies
// var express = require('express');
// var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
var expresssession = require('express-session');
var expressValidator = require('express-validator');
var flash = require('connect-flash');


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

	// Home Page
	app.get('/', function (req, res) {
		setupModel.find(function (err, data) {
	 		if (err) {
	 			throw err;
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
	 			throw err;
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
					throw err;
				}

				if ( req.body.email ) {
					sendRegistrationEmail( req.body.email );
					// sendSMS();
				}

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

	// Main Page
	app.get('/main', function (req, res) {
		res.render('pages/main', {
			Pagetitle: 'Main'
 		});
	});

};