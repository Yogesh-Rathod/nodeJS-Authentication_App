var bodyParser = require('body-parser');
// require Local modules
var setupModel = require('../models/setupModel');
var sendRegistrationEmail = require('./mailerController');

module.exports = function (app) {

	app.use( bodyParser.json() );
	app.use( bodyParser.urlencoded({ extended: true }) );

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

 	// Register Page
	app.get('/register', function (req, res) {
		setupModel.find(function (err, data) {
	 		if (err) {
	 			throw err;
	 		}
			res.render('pages/register', {
				Pagetitle: 'Register',
				successMessage: false
			});
	 	});
 	});

	// Save User's Data
	app.post('/user-registration', function (req, res) {

		var usersData = {
			fullname: req.body.name,
			email: req.body.email,
			password: req.body.password,
			mobilenumber: req.body.number,
			profileimage: req.body.picture
		};

		var usersInfo = new setupModel(usersData);

		usersInfo.save( function (err, data) {
			if (err) {
				throw err;
			}
			// sendRegistrationEmail( req.body.email );
			res.render('pages/register', {
				Pagetitle: 'Register',
				successMessage: true
			});
		});
	});

	// Login Page
	app.get('/login', function (req, res) {
		res.render('pages/login', {
			Pagetitle: 'Login'
 		});
	});

};