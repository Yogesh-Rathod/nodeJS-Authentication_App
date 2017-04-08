var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var RegistrationSchema = new Schema({
	fullname: String,
	email: String,
	mobilenumber: String,
	password: String,
	profileimage:  String
});

var nodeApp = mongoose.model('nodeApp', RegistrationSchema);

var User = module.exports = nodeApp;