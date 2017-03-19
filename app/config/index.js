var credentials = require('./credentials');

module.exports = {
	dbConnection: function() {
		return "mongodb://"+ credentials.username +":"+ credentials.password +"@ds131340.mlab.com:31340/firstappdb";
	}
}