const mysql = require('mysql2');

const pool = mysql.createPool({
    connectionLimit:10,
    host:'localhost',
    user:'alunods',
    password:'mate123',
    database:'vio_mateus'
})

module.exports = pool;
