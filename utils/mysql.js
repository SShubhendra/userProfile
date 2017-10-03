var mysql=require('mysql');

var connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'root',
    database:'user'
});

connection.connect((err)=>{
 if (err ) throw err;
 console.log('db connected successfully'); 
});

module.exports = connection;