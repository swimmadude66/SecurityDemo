const router = require('express').Router();
const apiDB = require('../middleware/db');

router.use((req, res, next) => {
  let headers = req.headers;
  let auth = +(headers.authorization || -1);
  apiDB.query('Select * from `users` where `UserId`='+auth+';', (err, results)=>{
    if(err){
      return res.status(400).send('could not look up user');
    }  else {
      if(results.length > 0) {
        res.locals.UserId = auth;
      }
      return next();
    }
  });
});

router.use('/auth', require('./auth'));
router.use('/posts', require('./posts'));
router.use('/comments', require('./comments'));

module.exports = router;
