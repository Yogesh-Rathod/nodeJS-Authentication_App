var bodyParser = require('body-parser');
// require Local modules
var setupModel = require('../models/setupModel');
var sendRegistrationEmail = require('./mailerController');

module.exports = function (app) {

	app.use( bodyParser.json() );
	app.use( bodyParser.urlencoded({ extended: true }) );

	app.get('/', function (req, res) {
		setupModel.find(function (err, data) {
	 		if (err) {
	 			throw err;
	 		}
			res.render('pages/index', { data: data });
	 	});
 	});

	app.post('/user-registration', function (req, res) {

		var usersData = {
			fullname: req.body.fullname,
			username: req.body.username,
			email: req.body.email,
			mobilenumber: req.body.mobilenumber,
			password: req.body.password,
		};

		var usersInfo = new setupModel(usersData);

		usersInfo.save( function (err, data) {
			if (err) {
				throw err;
			}
			sendRegistrationEmail( req.body.email );
			res.send(data);
		});
	});
}