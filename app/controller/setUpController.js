var setupModel = require('../models/setupModel');

module.exports = function (app) {
	app.get('/', function (req, res) {

		var userinfo = [
			{
				fullname: 'yogesh rathod',
				username: 'yrathod101',
				email: 'yrathod@gmail.com',
				mobilenumber: '9920105214',
				password: 'password'
			},
			{
				fullname: 'demo name',
				username: 'demousername',
				email: 'demo@demo.com',
				mobilenumber: '8286875250',
				password: 'password'
			}
		];

		setupModel.create( userinfo, function (err, data) {
			if (err) {
				throw err;
			}
			res.send(data);
		})
	})
}