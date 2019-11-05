const constants = {
	//defaultPort = 5000;

	get defaultPort() {
		return 5000;
	}
};

class Constants {
	//static port = 5001; //note:  not valid syntax in ES6(2015)

	static getPort() {
		return 5000;
	}

	static get port() {
		return 5000;
	}
}

// module.exports = constants;
module.exports = Constants;
