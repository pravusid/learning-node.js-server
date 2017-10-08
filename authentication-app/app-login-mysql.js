const express = require('express');
const session = require('express-session');
const bkfd2Password = require('pbkdf2-password');
const hasher = bkfd2Password();
const bodyParser = require('body-parser');
const MySQLStore = require('express-mysql-session');

const mysql = require('mysql');
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'idpravus',
  password: 'my-password',
  database: 'idpravus'
});
conn.connect();

const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
  secret: 'my-secret-key',
  resave: false,
  saveUninitialized: true,
  // store: new MySQLStore({
    //   host: 'localhost',
    //   port: 3306,
    //   user: 'idpravus',
    //   password: 'my-password',
    //   database: 'idpravus'
    // })
  }));

const passport = require('./app-login-mysql-passport')(app, conn, hasher);

const router = require('./app-login-mysql-router')(express, passport);
app.use('/', router);


app.listen(8080, () => {
  console.log('http://localhost:8080');
});
