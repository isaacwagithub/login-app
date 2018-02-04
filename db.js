var mysql = require('mysql');
var keys = require('./keys');

const connection = mysql.createConnection({
	host: keys.options.host,
	user: keys.options.user,
	password: keys.options.password,
	database: keys.options.database
});

connection.connect(function(error,results){
	if(error){
		console.log(error);
	}else{
		console.log('server connected to database');
	}
});

module.exports = connection;