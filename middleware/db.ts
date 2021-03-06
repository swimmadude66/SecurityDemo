const mysql = require('mysql');

const pool = mysql.createPool(
	{
		host:'localhost', 
		database:'securitydemo', 
		user:'root',  
		password: process.env.MYSQL_PASS || 'admin',
		multipleStatements: true
	}
);

module.exports = {
	query: function(){
		let sql_args = [];
		let args = [];
		for(var i=0; i<arguments.length; i++){
			args.push(arguments[i]);
		}
		let callback = args[args.length-1]; //last arg is callback
		pool.getConnection(function(err, connection) {
    	if(err) {
				console.log(err);
				callback(err);
				return;
			}
			if(args.length > 2){
				sql_args = args[1];
			}
	    var query = connection.query(args[0], sql_args, function(err, results) {
	      connection.release(); // always put connection back in pool after last query
	      if(err){
					console.log(err);
					callback(err);
				}
	      callback(null, results);
	    });
			console.log(query.sql);
		});
	},
	escape: function(arg){
		return mysql.escape(arg);
	}
};
