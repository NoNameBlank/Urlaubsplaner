const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'urlaubsplaner'

});
//promise macht es glecih A-synchron
module.exports = pool.promise();