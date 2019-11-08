const express = require('express');
const router = express.Router();
const User = require('../models/user');
const ApiResult = require('../dto/api-result');
const AppUtility = require('../common/app-utility');
const AppConst = require('../common/app-const');
const bcrypt = require('bcryptjs');
const passport = require('passport');

router.get('/login', (req, resp) => resp.send({ api: 'login.get' }));

//note: please notice the differences
//                          //...auth...() as middleware(router handler)
//
//(1) router.post('/login', passport.authenticate('local'), (req, res) => ...)
//(2) router.post('/login', (req, res, next) => { passport.authenticate('local', (err, user, verifyInfo) => ...)(req, res, next);  })
//
//                          //...auth...() called within router handler
//
//for case (1), by default, if authentication fails, Passport will respond with a 401 Unauthorized status,
//and any additional route handlers will not be invoked.
//If authentication succeeds, the next handler will be invoked and the req.user property will be set to the authenticated user.
router.post('/login', (req, resp, next) => {
	/*//can't redirect here since using angular as a separate frontend
	passport.authenticate('local', {
			successRedirect: '/feed',
			failureRedirect: '/faq',
			failureFlash: true
	})(req, resp, next);
    return; */

	//note: authenticate and return, use custom callback(instead of built in options - see above)
	//  - need manually call req.login() to establish a session in this case
	//[ref](https://www.djamware.com/post/5a878b3c80aca7059c142979/securing-mean-stack-angular-5-web-application-using-passport)
	passport.authenticate('local', (err, user, verifyOptions) => {
		console.log('passport auth callback:', err, user ? user.email : null, verifyOptions);
		const verifyMessage = verifyOptions != null ? verifyOptions.message : null;

		if (err) {
			handleError('login authenticate', err);
			resp.json(new ApiResult(false, null, verifyMessage));
			return;
		}

		if (!user) {
			resp.status(401).send(new ApiResult(false, null, verifyMessage));
		}

		req.login(user, err => {
			if (err) {
				handleError(err, 'req.login');
				next(err);
				return;
			}

			//resp.redirect('/feed'); return; //do the redirect on angular side
			resp.json(new ApiResult(true, desensitizeUser(user)));
		});
	})(req, resp, next);
});

router.get('/logout', (req, resp) => {
	req.logout();
	resp.json(new ApiResult(true, 'You have logged out'));
});

router.get('/register', (req, resp) => {
	//res.send('register.get ');
	resp.send('{"api": "register.get"}');
});

router.post('/register', (req, resp) => {
	console.log('post register:', req.body);
	//resp.send('{"api": "register.post"}'); return;
	const { email, password, password2 } = req.body;
	const errors = validateRegisterInfo(email, password, password2);

	if (errors.length > 0) {
		resp.send(new ApiResult(false, { regInfo: desensitizeReq(req.body) }, errors));
		return;
	}

	let { name } = req.body;
	//assign default name if not set
	if (!name || String(name).trim().length == 0) {
		name = String(email).split('@')[0];
	}

	const emailLower = String(email).toLowerCase();

	User.findOne({ emailLower: emailLower }).then(user => {
		if (user) {
			errors.push(`email already registered`);
			resp.send(new ApiResult(false, { regInfo: desensitizeReq(req.body) }, errors));
			return;
		}

		const newUser = new User({ name, email, emailLower, password });

		bcrypt.genSalt(AppConst.bcryptSaltRounds, (err, salt) => {
			if (err) {
				handleError('gen salt error', err, true);
			}

			bcrypt
				.hash(newUser.password, salt)
				.then(hashedPassword => {
					newUser.password = hashedPassword;
					newUser
						.save()
						.then(savedUser => {
							//todo: impl flash message
							//req.flash('success_msg', 'You are now registered');
							// resp.redirect('/users/login');
							resp.send(new ApiResult(true, desensitizeUser(savedUser), 'You are now registered'));
						})
						.catch(err => {
							handleError('save-newUser-error', err, true);
						});
				})
				.catch(hashErr => {
					handleError('hash pwd error', hashErr, true);
				});
		});
	});

	function desensitizeReq(reqBody) {
		delete reqBody.password;
		delete reqBody.password2;
		return reqBody;
	}

	function validateRegisterInfo(email, password, password2) {
		const errors = [];

		if (!AppUtility.validateEmail(email)) {
			errors.push('Please input a valid email');
		}

		if (!password) {
			errors.push('Please input password');
		} else {
			if (password != password2) {
				errors.push('Passwords do not match');
			}

			if (password.length < 6) {
				errors.push('Password must be at least 6 characters');
			}
		}

		return errors;
	}
});

//todo: error handling
function handleError(source, error, rethrow = false) {
	console.log(source + ':', error);

	if (rethrow) {
		throw error;
	}
}

function desensitizeUser(user) {
	return {
		name: user.name,
		email: user.email,
		registerDate: user.date
	};
}

module.exports = router;
