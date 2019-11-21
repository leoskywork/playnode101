class AppUtility {
	static validateEmail(email) {
		if (!email) return false;

		const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return reg.test(String(email).toLowerCase());
	}

	static notEmpty(value) {
		return value && String(value).trim().length > 0;
	}

	static sleep(ms) {
		return new Promise((resolve, _) => {
			setTimeout(resolve, ms);
		});
	}
}

module.exports = AppUtility;
