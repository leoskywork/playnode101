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

	static fail(message) {
		return new ApiResult(false, null, message);
	}

	static success(data, message = null) {
		return new ApiResult(true, data, message);
	}
}

module.exports = ApiResult;
