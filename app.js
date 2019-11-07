const express = require('express');
const mongoose = require('mongoose');
const expressSession = require('express-session');
const passport = require('passport');
const connectFlash = require('connect-flash');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo')(expressSession);

const AppConst = require('./common/app-const');
const Auth = require('./common/auth');

const app = express();

//----- body parser - put this before routes
//todo: [x] what does 'extended' do? set to true?
//[ref](https://stackoverflow.com/questions/24543847/req-body-empty-on-posts)
app.use(express.static('public'));
//app.use(express.urlencoded({ extended: true }));
//app.use(express.json());
//app.use(express.cookieParser()); //express v4+ no longer provide
//--above not working
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

//----- express - put this before passport
app.use(
	expressSession({
		//secret can be any random chars
		secret: 'secret101',
		resave: true,
		saveUninitialized: true,
		store: new MongoStore({
			url: AppConst.mongoConfig.mongoUri,
			// collection: 'expressSessions', //default sessions
			ttl: 14 * 24 * 60 * 60 //default 14 days
		})
		//todo: ??
		// cookie: {
		//     maxAge: 60 * 1000
		//     //for https
		//     //secure: true
		// }
	})
);

//----- passport
const auth = new Auth();
auth.configPassport(passport);
app.use(passport.initialize());
app.use(passport.session());

//----- connect flash
app.use(connectFlash());
app.use((req, resp, next) => {
	//error set in Auth.configPassport()
	resp.locals.error = req.flash('error');

	next();
});

//----- cors - put this before routes
const cors = require('cors');
app.use(
	cors({
		//note: enable http cookies(sessions) over cors
		//  - [ref](https://medium.com/@alexishevia/using-cors-in-express-cac7e29b005b)
		//  - also need to set withCredentials to true when making ajax call
		credentials: true,
		//  - enable one client host
		//origin: AppConst.clientAppHost
		//  - enable client host list, better define allowedOrigins outside
		origin: (origin, callback) => {
			if (!origin) return callback(null, true);
			const allowedOrigins = [AppConst.clientAppHost];

			if (allowedOrigins.indexOf(origin) === -1) {
				return callback(new Error(`CORS policy disallow access from origin: ${origin}`), false);
			}
			return callback(null, true);
		}
	})
);

//----- routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

//----- db
const dbUri = AppConst.mongoConfig.mongoUri;
console.log(`local mongodb ${AppConst.mongoConfig.useLocal}`);
//console.log(dbUri);
if (AppConst.dev.enableDB) {
	mongoose
		.connect(dbUri, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			//fix DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.
			useCreateIndex: true
		})
		.then(() => {
			console.log('mango db connected');
		})
		.catch(error => {
			//todo: error handling
			console.log(`mango db error: ${error}`);
		});
}

//----- error handling middleware - put it at last
//note: [ref](https://expressjs.com/en/guide/error-handling.html)
app.use(logError);
app.use(xhrErrorHandler);
app.use(generalErrorHandler);

function logError(err, req, resp, next) {
	console.log('app.logError: ', err);
	next(err);
}

function xhrErrorHandler(err, req, resp, next) {
	if (req.xhr) {
		//DO NOT call next() here since we already set(send back) the response
		resp.status(500).send({ error: err.message | 'xhr request error' });
	} else {
		next(err);
	}
}

function generalErrorHandler(err, req, resp, next) {
	resp.status(500);
	resp.render('error', { error: err });
}

const port = process.env.PORT || AppConst.port;
app.listen(port, console.log(`server started on port ${port}`));
console.log('env', app.get('env'));
