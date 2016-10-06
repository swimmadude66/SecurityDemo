const express     = require('express');
const bodyParser  = require('body-parser');
const morgan      = require('morgan');
const mysql       = require('mysql');

let port = 3000;

const app = express();



app.use(morgan('dev'));
app.use(bodyParser.json({limit: '50mb'}));

app.use('/api', require('./routes/api'));

app.all(
  (req, res, next) => res.status(404).send('No such endpoint')
);

app.listen(port);
console.log('App started on port', port);
