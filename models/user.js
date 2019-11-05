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
	//it's case sensitive when doing mongoose.find(), so store lowered case for match
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
