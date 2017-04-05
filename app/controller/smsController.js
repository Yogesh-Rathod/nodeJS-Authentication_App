var Nexmo = require('nexmo');


var nexmo = new Nexmo({
  apiKey: '01a79185',
  apiSecret: 'd8813c7a47ed5f6f'
});

module.exports = function(argument) {
	nexmo.message.sendSms(
  '8286875250', '918286875250', 'First SMS', function(err, responseData) {
      if (err) {
        console.log(err);
      } else {
        console.dir(responseData);
      }
    }
 	);
}