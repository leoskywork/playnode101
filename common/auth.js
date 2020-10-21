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
                    if (err) this.handleError(err, 'User.findOne', true);

                    //params for done method: (error, user, verifyOptions)
                    if (!user) return done(null, null, { message: `Email ${email} is not registered` });

                    bcrypt.compare(password, user.password, (pwdErr, match) => {
                        if (pwdErr) this.handleError(pwdErr, 'bcrypt.compare', true);

                        this.log('auth bcrypt.compare result', match);

                        if (match) {
                            return done(null, user);
                        } else {
                            return done(null, null, { message: 'password incorrect' });
                        }
                    });
                });
            })
        );

        passport.serializeUser((user, done) => {
            this.log('serialize user ' + user.emailLower, user.id);

            //note: this function will be called if req.login() passes, only the user.id is serialized to the session,
            //  keeping the amount of data stored within the session small, when subsequent requests are received, this id
            //  is used to find the user(ref deserializeUser()), which will be restored to req.user.
            done(null, user.id);
        });

        passport.deserializeUser((id, done) => {
            this.log('deserialize user', id);

            User.findById(id, (err, user) => {
                if (err) {
                    this.handleError(err, 'deserialize user');
                    return done(err);
                }

                done(null, user);
            });
        });
    }

    //?? seems not working
    // desensitizeUser(user) {
    // 	delete user.password;
    // 	delete user.emailLower;
    // 	return user;
    // }

    //todo: error handling
    handleError(error, source = 'auth', rethrow = false) {
        console.log(source + ':', error);
        if (rethrow) throw error;
    }

    log(source, message) {
        console.log(source + ':', message);
    }
}

module.exports = Auth;
