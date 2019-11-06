const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/user');

class Auth {
	configPassport(passport) {
		if (!passport) throw 'passport required';

		passport.use(
			new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
				if (!email) throw 'email required';

				User.findOne({ emailLower: String(email).toLowerCase() }, (err, user) => {
					if (err) this.handleError(err);

					if (!user) return done(null, null, { message: `Email ${email} is not registered` });

					bcrypt.compare(password, user.password, (err, match) => {
						if (err) this.handleError(err, 'bcrypt.compare');

						this.log(match, 'bcrypt.compare result');

						if (match) {
							return done(null, this.desensitizeUser(user));
						} else {
							return done(null, null, { message: 'password incorrect' });
						}
					});
				});
			})
		);

		passport.serializeUser((user, done) => {
			this.log(user, 'serializeUser');
			done(null, user.id);
		});

		passport.deserializeUser((id, done) => {
			User.findById(id, (err, user) => {
				this.handleError(err, 'deserializeUser', false);
				done(err, user);
			});
		});
	}

	//?? seems not working
	desensitizeUser(user) {
		delete user.password;
		delete user.emailLower;
		return user;
	}

	//todo: error handling
	handleError(error, source = 'auth', rethrow = true) {
		console.log(source, error);
		if (rethrow) throw error;
	}

	log(message, source = 'auth') {
		console.log(source + ':', message);
	}
}

module.exports = Auth;
