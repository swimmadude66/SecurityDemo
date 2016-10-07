const authRouter = require('express').Router();
const authDB = require('../middleware/db');

function doLogin(username, password, callback){
  authDB.query('Select * from `users` where `Username` = \'' + username +'\';', (err, results) => {
    if(err) {
      return callback('Error checking login');
    } else {
      if(results.length < 1) {
        return callback('Invalid username');
      } else {
        if(results[0].Password === password) {
          return callback(null, {UserId: results[0].UserId});
        } else {
          return callback('Invalid password');
        }
      }
    }
  });
}

authRouter.post('/signup', (req, res, next) => {
  let body = req.body;
  if (body.Username && body.Password) {
    authDB.query('Insert into `users` (`Username`, `Password`) VALUES(\'' + body.Username +'\', \'' + body.Password+'\');', (err, result) => {
      if(err) {
        return res.status(400).send('Error signing up');
      } else {
        doLogin(body.Username, body.Password, (err, userId) =>{
          if(err){
            return res.status(400).send(err);
          } else {
            return res.status(200).send(userId);
          }
        });
      }
    });
  } else {
    return res.status(400).send('username and password are required');
  }
});

authRouter.post('/login', (req, res, next) => {
  let body = req.body;
  if (body.Username && body.Password) {
    doLogin(body.Username, body.Password, (err, userId) =>{
      if(err){
        return res.status(400).send(err);
      } else {
        return res.status(200).send(userId);
      }
    });
  } else {
    return res.status(400).send('username and password are required');
  }
});

module.exports = authRouter;
