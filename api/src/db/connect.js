const mysql = require('mysql2');

const pool = mysql.createPool({
    connectionLimit:10,
    host:'localhost',
    user:'matezin',
    password:'1234',
    database:'vio_mateus'
})

module.exports = pool;
