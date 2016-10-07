const express     = require('express');
const bodyParser  = require('body-parser');
const morgan      = require('morgan');
const path        = require('path');
let port = 3000;

const app = express();



app.use(morgan('dev'));
app.use(bodyParser.json({limit: '50mb'}));

/*------- Angular client on Root ------- */
app.set('view engine','html');
app.use(express.static(path.join(__dirname, 'client')));

app.use('/api', require('./routes/api'));

app.all(
  (req, res, next) => res.status(404).send('No such endpoint')
);

app.listen(port);
console.log('App started on port', port);
