class ApiResult {
	constructor(success, data = null, message = null) {
		this.success = success;

		if (message) {
			this.message = message;
		}

		if (data) {
			this.data = data;
		}
	}
}

module.exports = ApiResult;
