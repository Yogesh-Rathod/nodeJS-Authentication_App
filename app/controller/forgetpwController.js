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
	  subject: "Yogesh Rathod's NodeJS App Reset User Password Link",
	  html: "<p>Here is the Link to reset your Password.</p><div><a href='http://localhost:3000/resetpassword/"+usersEmail+">http://localhost:3000/resetpassword/</a></div>"
	}

	transporter.sendMail(mailOptions, function(err, info) {
		if (err) {
			throw err;
		}
		console.log('Reset Password Mail Successfully Sent.');
	});
}