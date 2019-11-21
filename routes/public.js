const express = require('express');
const Task = require('../models/task');
const AppConst = require('../common/app-const');
const ApiResult = require('../dto/api-result');
const Utility = require('../common/app-utility');
const router = express.Router();

router.get('/', async (req, res) => {
	if (await defenderFindSpam(res)) return;
	res.sendStatus(200);
});

router.get('/todos', async (req, res) => {
	if (await defenderFindSpam(res)) return;
	let limit = req.query.limit || AppConst.mongoConfig.defaultRowCount;
	limit = Math.min(limit, AppConst.mongoConfig.maxRowCount);

	try {
		const tasks = await Task.find()
			.sort({ date: -1 })
			.limit(limit);
		res.json(new ApiResult(true, tasks));
	} catch (error) {
		res.json(ApiResult.fail('fail to get due to: ' + error));
	}
});

router.get('/todos/:id', async (req, res) => {
	if (await defenderFindSpam(res)) return;
	if (!req.params.id) return res.json(ApiResult.fail('id not set'));

	try {
		const todo = await Task.findById(req.params.id);
		if (todo) {
			return res.json(ApiResult.success(todo));
		} else {
			return res.json(ApiResult.fail('can not find item by id'));
		}
	} catch (error) {
		return res.json(ApiResult.fail('fail to find by id due to: ' + error));
	}
});

router.put('/todos', async (req, res) => {
	if (await defenderFindSpam(res)) return;
	checkInsertOrUpdateTaskPreconditions(req, res);
	if (res.body) return;

	try {
		const count = await Task.countDocuments();

		if (count >= AppConst.mongoConfig.maxRowCount) {
			return res.json(ApiResult.fail('exceeded item count limit, delete some items then try to add'));
		}

		const newTodo = new Task({ title: req.body.title, remark: req.body.remark, due: req.body.due, date: Date.now() });
		const savedTodo = await newTodo.save();
		return res.json(ApiResult.success(savedTodo));
	} catch (error) {
		return res.json(ApiResult.fail('failed to add due to: ' + error));
	}
});

function checkInsertOrUpdateTaskPreconditions(req, res) {
	if (!req.body) return res.json(ApiResult.fail('post body not set'));

	if (!req.body.title) return res.json(ApiResult.fail('title of todo not set'));
	if (req.body.title.length > AppConst.mongoConfig.maxTitleLength) return res.json(ApiResult.fail('title too long'));

	if (req.body.remark && req.body.remark.length > AppConst.mongoConfig.maxParagraphLength) return res.json(ApiResult.fail('remark too long'));

	if (req.body.due) {
		if (isNaN(Date.parse(req.body.due))) return res.json(ApiResult.fail(`fail to parse due date [${req.body.due}]`));

		//fixme: potential time zone offset
		if (new Date(req.body.due).getTime() < Date.now()) return res.json(ApiResult.fail(`due time [${req.body.due}] is a past date`));
	}
}

let apiAccessCount = 1;

async function defenderFindSpam(res) {
	console.log('defend against spam ', apiAccessCount);

	if (apiAccessCount % ((new Date().getHours() + 2) * 100) === 0) {
		await Utility.sleep(5000);
		res.json(`spam! 0xaa${apiAccessCount}`);
		return true;
	}

	apiAccessCount++;
	return false;
}

router.post('/todos/:id', async (req, res) => {
	if (await defenderFindSpam(res)) return;
	if (!req.params || !req.params.id) return res.json('id not set');
	checkInsertOrUpdateTaskPreconditions(req, res);
	if (res.body) return;

	try {
		const oldTodo = await Task.findById(req.params.id);
		if (!oldTodo) return res.json(ApiResult.fail('item no exist'));

		if (Utility.notEmpty(req.body.title)) oldTodo.title = req.body.title;
		if (req.body.completed != null) oldTodo.completed = !!req.body.completed;
		oldTodo.remark = req.body.remark;
		oldTodo.due = req.body.due;

		//todo: get by session
		oldTodo.lastUpdateBy = '<fixme>';
		oldTodo.lastUpdateAt = Date.now();

		const savedTodo = await oldTodo.save();
		return res.json(ApiResult.success(savedTodo));
	} catch (error) {
		return res.json(ApiResult.fail('fail to update due to: ' + error));
	}
});

router.delete('/todos/:id', async (req, res) => {
	if (await defenderFindSpam(res)) return;
	if (!req.params || !req.params.id) return res.json(ApiResult.fail('id not set'));

	try {
		const id = req.params.id;
		await Task.deleteOne({ _id: id });
		// unify the response format
		// return res.sendStatus(204);
		return res.json(ApiResult.success('code ' + 204));
	} catch (error) {
		return res.json(ApiResult.fail('fail to delete due to : ' + error));
	}
});

module.exports = router;
