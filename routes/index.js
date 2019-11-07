const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.send('hello, nodejs'));

router.get('/feed', (req, res) => {
	console.log('get feed req.body:', req.body);
	console.log('get feed authenticated:', req.isAuthenticated());
	console.log('get feed req.user:', req.user ? req.user.email : null);

	res.json('feed.get');
});

module.exports = router;
