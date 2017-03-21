var nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'yr16666@gmail.com',
    pass: 'Yogeshrock@101'
  }
});

// send mail with defined transport object
module.exports = function(usersEmail) {
	// setup email data with unicode symbols
	let mailOptions = {
	  from: '"Yogesh Rathod " <yr1666@gmail.com>',
	  to: usersEmail,
	  subject: "Successfully Registered on Yogesh Rathod's MEAN Stack App.",
	  html: "<b>Thank you For Registering on Yogesh Rathod's MEAN Stack App.</b>"
	};
	transporter.sendMail(mailOptions, (err, info) => {
		if (err) {
			throw err;
		}
		console.log('Message Successfully Sent.');
	});
}