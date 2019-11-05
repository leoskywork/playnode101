const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => res.send('login'));

router.get('/register', (req, res) => {
	//res.send('register.get ');
	res.send('{"api": "register.get"}');
});

router.post('/register', (req, res) => {
	console.log(req.body);

	res.send('{"api": "register.post"}');
});

module.exports = router;
