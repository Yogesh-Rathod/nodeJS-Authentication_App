var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var RegistrationSchema = new Schema({
	fullname: String,
	username: String,
	email: String,
	mobilenumber: String,
	password: String
});

var nodeApp = mongoose.model('nodeApp', RegistrationSchema);

module.exports = nodeApp;