const express = require('express');
const router = express.Router();
const passport = require('passport');

let newsReqCount = 0;

router.get('/', (req, res) => res.send('hello, nodejs'));

router.get('/news', (req, res) => {
	newsReqCount++;

	res.json({
		api: 'GET /news',
		auth: req.isAuthenticated(),
		user: req.user ? req.user.email : '<none>',
		serial: newsReqCount,
		data: 'topic 1'
	});
});

router.get('/feed', (req, res) => {
	console.log('get feed req.body:', req.body);
	console.log('get feed authenticated:', req.isAuthenticated());
	console.log('get feed req.user:', req.user ? req.user.email : null);

	res.json('feed.get auth: ' + req.isAuthenticated());
});

//note: a typical auth guard (for local strategy) impl
//  - client should redirect to login when received 401
router.get(
	'/feedGuarded',
	(req, res, next) => {
		//why being called twice when not authenticated?
		console.log('get feedGuarded2 authenticated:', req.isAuthenticated());
		console.log('get feedGuarded2 req.user:', req.user ? req.user.email : null);

		if (req.isAuthenticated()) {
			next();
		} else {
			res.sendStatus(401);
		}
	},
	(req, res) => {
		console.log('get feedGuarded3 req.body:', req.body);
		console.log('get feedGuarded3 authenticated:', req.isAuthenticated());
		console.log('get feedGuarded3 req.user:', req.user ? req.user.email : null);

		res.json('feed.feedGuarded auth: ' + req.isAuthenticated());
	}
);

//note: passport.authenticate(...) as router handler
//  - will call bcrypt.compare()
//  - req need provide credentials(username & password for 'local', jwt token for 'jwt'?)
router.get('/secured', passport.authenticate('local', { session: false }), (req, res) => {
	//won't be invoked if auth was failed
	console.log('get secured, req.body:', req.body);
	console.log('get secured authenticated:', req.isAuthenticated());
	console.log('get secured req.user', req.user ? req.user.email : null);

	res.json('secured.get auth: ' + req.isAuthenticated());
});

router.post('/secured', passport.authenticate('local', { session: false }), (req, res) => {
	//won't be invoked if auth was failed
	console.log('post secured, req.body:', req.body);
	console.log('post secured authenticated:', req.isAuthenticated());
	console.log('post secured req.user', req.user ? req.user.email : null);

	res.json('secured.post auth: ' + req.isAuthenticated());
});

module.exports = router;
