// const constants = {
// 	//defaultPort = 5000;
// 	get defaultPort() {
// 		return 5000;
// 	}
// };
// module.exports = constants;

//todo: rename to AppConst
class Constants {
	//static port = 5000; //note:  not valid syntax in ES6(2015)
	static get port() {
		return 5000;
	}

	static get mongopwd() {
		return 'angular101pwd';
		// return 'node101';
	}

	static get modelNames() {
		return {
			get user() {
				return 'User';
			}
		};
	}
}

module.exports = Constants;
