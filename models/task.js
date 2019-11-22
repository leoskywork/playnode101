const mongoose = require('mongoose');
const AppConst = require('../common/app-const');

const taskSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
		maxlength: AppConst.mongoConfig.maxTitleLength
	},
	remark: {
		type: String,
		maxlength: AppConst.mongoConfig.maxParagraphLength
	},
	completed: {
		type: Boolean,
		required: true,
		default: false
	},
	createBy: {
		type: String,
		required: true,
		maxlength: AppConst.mongoConfig.maxNameLength
	},
	createAt: {
		type: Date,
		//note: find duplicate values of date even rows are inserted at diff times, due to cache??
		//  - have to manual set the right value before call save()
		default: Date.now()
	},
	due: {
		type: Date
	},
	lastUpdateBy: {
		type: String,
		maxlength: AppConst.mongoConfig.maxNameLength
	},
	lastUpdateAt: {
		type: Date
	}
});

module.exports = mongoose.model(AppConst.modelNames.task, taskSchema);
