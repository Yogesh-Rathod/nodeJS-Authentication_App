// Setup express
var express = require('express');
var app = express();
var socialLoginClass = require("social-login");

// Init
var socialLogin = new socialLoginClass({
	app: app,
	url: 'http://localhost:3000',
    onAuth: function(req, type, uniqueProperty, accessToken, refreshToken, profile, done) {
        findOrCreate({
		profile: profile,
		property: uniqueProperty,
		type: type
		}, function(user) {
			done(null, user);
		});
	}
});

// Setup the various services:
socialLogin.use({
  facebook:	{
		settings:	{
			clientID:		"YOUR_API_KEY",
			clientSecret: 	"YOUR_API_SECRET",
			authParameters:	{
				scope: 'read_stream,manage_pages'
			}
		},
		url:	{
			auth:		"/auth/facebook",           // The URL to use to login (<a href="/auth/facebook">Login with facebook</a>).
			callback: 	"/auth/facebook/callback",  // The Oauth callback url as specified in your facebook app's settings
			success:	'/',                        // Where to redirect the user once he's logged in
			fail:		'/auth/facebook/fail'       // Where to redirect the user if the login failed or was canceled.
		}
	},

	google:	{
		settings:	{},
		url:	{
			auth:		"/auth/google",
			callback: 	"/auth/google/callback",
			success:	'/',
			fail:		'/auth/google/fail'
		}
	}
});