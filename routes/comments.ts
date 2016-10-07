const commentRouter = require('express').Router();
const commentDB = require('../middleware/db');

function makeComment(message: string, id: number, postId:number, author:number, callback){
  let query = 'Insert into `comments` ';
  let insert = '(`CommentId`, `PostId`, `Message`) VALUES ('+id+', ' + postId+', \''+message+'\')';
  if (id < 1){
    insert = '(`PostId`, `Message`, `Author`) VALUES ('+postId+', \''+message+'\', '+author+')';
  }
  let collision = ' ON DUPLICATE KEY UPDATE `Message` = VALUES(`Message`);';
  let q = query+insert+collision;
  commentDB.query(q, (err, result)=>{
    if(err){
      return callback(err);
    }  else{
      let commentId = result.insertId;
      return callback(null, {CommentId: commentId});
    }
  });
}

commentRouter.use((req, res, next)=>{
  let body = req.body;
  if(!res.locals.UserId){
    return res.status(401).send('Unauthorized');
  }
  if(!(body.Message && body.PostId)){
    return res.status(400).send('Message and PostId are required fields');
  } else{
    return next();
  }
})

commentRouter.post('/', (req, res, next) =>{
  makeComment(req.body.Message, null, req.body.PostId, res.locals.UserId, (err, commentId)=>{
    if(err){
      return res.status(400).send('Could not post comment');
    } else{
      return res.status(200).send(commentId);
    }
  });
});

commentRouter.post('/:id', (req, res, next) =>{
  makeComment(req.body.Message, req.params.id, req.body.PostId, res.locals.UserId, (err, commentId)=>{
    if(err){
      return res.status(400).send('Could not post comment');
    } else{
      return res.status(200).send(commentId);
    }
  });
});

module.exports = commentRouter;
