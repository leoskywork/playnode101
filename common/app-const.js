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

	static get bcryptSaltRounds() {
		return 10;
	}

	static get mongoConfig() {
		return {
			get useCloud() {
				return false;
			},

			get mongoUri() {
				return this.useCloud ? this.mongoCloud : this.mongoLocal;
			},

			get mongoCloud() {
				return `mongodb+srv://angular101:${encodeURIComponent(this.mongopwd)}@aws-sgp-a1-xzhdi.mongodb.net/test?retryWrites=true&w=majority`;
			},
			//copy the following uri then open mongoDB compass, it will auto fill connect fields(except pwd, which need manually input)
			//mongoCompassUri: 'mongodb+srv://angular101:<password>@aws-sgp-a1-xzhdi.mongodb.net/test',
			//mongoShellUri: 'mongo "mongodb+srv://aws-sgp-a1-xzhdi.mongodb.net/test"  --username angular101'

			get mongoLocal() {
				return `mongodb://node101:${encodeURIComponent(this.mongopwd)}@localhost/test?retryWrites=true&w=majority`;
			},

			get mongopwd() {
				// return 'angular101';
				return 'node101pwd';
			}
		};
	}

	static get modelNames() {
		return {
			get user() {
				return 'User';
			}
		};
	}

	//----- for dev
	static get devEnableDB() {
		return true;
	}
}

module.exports = Constants;
