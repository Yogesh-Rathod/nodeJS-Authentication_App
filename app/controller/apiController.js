var bodyParser = require('body-parser');

var setupModel = require('../models/setupModel');

module.exports = function (app) {

	app.use( bodyParser.json() );
	app.use( bodyParser.urlencoded({ extended: true }) );

	app.get('/', function (req, res) {
		setupModel.find(function (err, data) {
	 		if (err) {
	 			throw err;
	 		}
			res.render('pages/index');
	 	})
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
			res.send(data);
		});
	});
}