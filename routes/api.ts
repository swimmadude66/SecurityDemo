const router = require('express').Router();

router.use('/auth', require('./auth'));
router.use('/posts', require('./posts'));
router.use('/comments', require('./comments'));

module.exports = router;
