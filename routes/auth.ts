const authRouter = require('express').Router();
const db = require('../middleware/db');

authRouter.post('/signup', (req, res, next) => {
  let body = req.body;
  if (body.Username && body.Password) {
    db.query('Insert into Users (Username, Password) VALUES(' + body.Username +', ' + body.Password+');', (err, result) => {
      if(err) {
        return res.status(400).send('Error signing up');
      } else {
        return res.redirect('/api/auth/login');
      }
    });
  }
});

authRouter.post('/login', (req, res, next) => {
  let body = req.body;
  if (body.Username && body.Password) {
    db.query('Select * from Users where Username = ' + body.Username +';', (err, results) => {
      if(err) {
        return res.status(400).send('Error checking login');
      } else {
        if(results.length < 1) {
          return res.status(400).send('Invalid username');
        } else {
          if(results[0].Password === req.body.Password) {
            return res.status(200).send({UserId: results[0].Id});
          } else {
            return res.status(400).send('Invalid password');
          }
        }
      }
    });
  }
});

module.exports = router;
