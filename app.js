const express = require('express');
const AppConst = require('./common/app-const');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || AppConst.port;

//----- body parser - put this before routes
//todo: what does 'extended' do? set to true?
//[ref](https://stackoverflow.com/questions/24543847/req-body-empty-on-posts)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//----- cors - put this before routes
const cors = require('cors');
app.use(cors());

//----- routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

//----- db
const dbUri = require('./common/keys').mongoUri;
// console.log(dbUri);
if (AppConst.devEnableDB) {
	mongoose
		.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
		.then(() => {
			console.log('mango db connected');
		})
		.catch(error => {
			//todo: error handling
			console.log(`mango db error: ${error}`);
		});
}

app.listen(port, console.log(`server started on port ${port}`));
