const mongoose = require('mongoose');
const AppConst = require('../common/app-const');

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	//note: it's case sensitive when doing mongoose.find(), so store lowered case for match
	//another way to do it is to create a case insensitive index on the property
	//  [ref](https://docs.mongodb.com/manual/core/index-case-insensitive/)
	//or search by regex
	//  [ref](https://stackoverflow.com/questions/1863399/mongodb-is-it-possible-to-make-a-case-insensitive-query)
	emailLower: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		default: Date.now()
	}
});

module.exports = mongoose.model(AppConst.modelNames.user, userSchema);
