const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    connectionLimit:10,
    // host:'localhost',
    // user:'alunods',
    // password:'senai@604',
    // database:'vio_mateus'
    host:process.env.MYSQLHOST || process.env.DB_HOST, 
    user:process.env.MYSQLUSER || process.env.DB_USER,
    password:process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
    database:process.env.DATABASE || process.env.DB_NAME,
    port:process.env.MYSQLPORT || 3306
})

module.exports = pool;
