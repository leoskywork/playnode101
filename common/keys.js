// const keys = {
// 	mongoUri: 'mongodb+srv://angular101:angular101pwd@aws-sgp-a1-xzhdi.mongodb.net/test?retryWrites=true&w=majority'
// };

// module.exports = keys;
const AppConst = require('./app-const');

module.exports = {
	mongoUri: `mongodb+srv://angular101:${encodeURIComponent(AppConst.mongopwd)}@aws-sgp-a1-xzhdi.mongodb.net/test?retryWrites=true&w=majority`,

	//copy the following uri then open mongoDB compass, it will auto fill connect fields(except pwd, which need manually input)
	mongoCompassUri: 'mongodb+srv://angular101:<password>@aws-sgp-a1-xzhdi.mongodb.net/test',
	mongoShellUri: 'mongo "mongodb+srv://aws-sgp-a1-xzhdi.mongodb.net/test"  --username angular101'
};
