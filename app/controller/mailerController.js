var nodemailer = require('nodemailer');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'yr16666@gmail.com',
    pass: '8286875250'
  }
});

// send mail with defined transport object
module.exports = function(usersEmail) {
	// setup email data with unicode symbols
	var mailOptions = {
	  from: '"Yogesh Rathod" <yr1666@gmail.com>',
	  to: usersEmail,
	  subject: "Successfully Registered on Yogesh Rathod's NodeJS App.",
	  html: "<b>Thank you For Registering on Yogesh Rathod's NodeJS App.</b>"
	}

	transporter.sendMail(mailOptions, function(err, info) {
		if (err) {
			console.log(err);
		}
		console.log('Message Successfully Sent.');
	});
}