var mysql = require('mysql');
var Promise = require('bluebird');
var using = Promise.using;
Promise.promisifyAll(require('mysql/lib/Connection').prototype);
Promise.promisifyAll(require('mysql/lib/Pool').prototype);


var pool = mysql.createPool({
    host:'localhost',
    user:'root',
    password:'root',
    database:'user'
});

var getConnection = function () {
 return pool.getConnectionAsync().disposer(function (connection) {
 return connection.destroy();
 });
};
var query = function (command) {
 return using(getConnection(), function (connection) {
 return connection.queryAsync(command);
 });
};

module.exports = {
    query: query
};