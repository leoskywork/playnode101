const express = require('express');
const router = express.Router();
const User = require('../models/user');
const ApiResult = require('../dto/api-result');
const AppUtility = require('../common/app-utility');
const AppConst = require('../common/app-const');
const bcrypt = require('bcryptjs');
const passport = require('passport');

router.get('/login', (req, resp) => resp.send({ api: 'login.get' }));

router.post('/login', (req, resp, next) => {
	passport.authenticate('local', {
		successRedirect: '/about',
		failureRedirect: '/faq',
		failureFlash: true
	})(req, resp, next);
});

router.get('/logout', (req, resp) => {
	req.logout();
	req.flash('success_msg', 'you are logged out');
	resp.redirect('/login');
});

router.get('/register', (req, resp) => {
	//res.send('register.get ');
	resp.send('{"api": "register.get"}');
});

router.post('/register', (req, resp) => {
	console.log(req.body);
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
				handleError('gen salt error', err);
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
							resp.send(new ApiResult(true, { name: savedUser.name, email: savedUser.email }, 'You are now registered'));
						})
						.catch(err => {
							handleError('save-newUser-error', err);
						});
				})
				.catch(hashErr => {
					handleError('hash pwd error', hashErr);
				});
		});
	});

	function desensitizeReq(reqBody) {
		delete reqBody.password;
		delete reqBody.password2;
		return reqBody;
	}

	//todo: error handling
	function handleError(source, error) {
		console.log(source, error);
		throw error;
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

module.exports = router;
