const postRouter = require('express').Router();
let postDB = require('../middleware/db');

function makePost(message: string, id: number, author:number, callback){
  let query = 'Insert into `posts` ';
  let insert = '(`PostId`, `Message`, `Author`) VALUES ('+id+', \''+message+'\', '+author+')';
  if (id < 1){
    insert = '(`Message`, `Author`) VALUES (\''+message+'\', '+author+')';
  }
  let collision = ' ON DUPLICATE KEY UPDATE `Message` = VALUES(`Message`);';
  postDB.query(query+insert+collision, (err, result)=>{
    if(err){
      return callback(err);
    }  else{
      let postId = result.insertId;
      return callback(null, {PostId: postId});
    }
  });
}

postRouter.get('/', (req, res, next)=> {
  postDB.query('Select `posts`.*, `users`.`Username` as `AuthorName` from `posts` join `users` on `users`.`UserId`=`posts`.`Author`;', (err, results) =>{
    if(err){
      return res.status(500).send('Could not retrieve posts');
    } else{
      let posts = {};
      results.forEach((r) => {
        posts[r.PostId] = r;
      });
      postDB.query('Select `comments`.*, `users`.`Username` as AuthorName from `comments` join `users` on `users`.`UserId`=`comments`.`Author`;', (err, comments) => {
        if(err) {
          return res.status(500).send('Could not retrieve posts');
        } else {
          comments.forEach((c) =>{
              let parent = posts[c.PostId];
              if (!parent.Comments) {
                parent.Comments = [];
              }
              parent.Comments.push(c);
          });
          let feed = [];
          for(let key in posts){
            feed.push(posts[key]);
          }
          return res.status(200).send(feed);
        }
      });
    }
  });
});

postRouter.use((req, res, next) => {
  if(res.locals.UserId){
    return next();
  } else{
    return res.status(401).send('Unauthorized');
  }
})

postRouter.post('/', (req, res, next) => {
  let body = req.body;
  if(body.Message){
    makePost(req.body.Message, -1, res.locals.UserId, (err, id)=> {
      if(err){
        return res.status(400).send(err);
      } else{
        return res.status(200).send(id);
      }
    });
  } else {
    return res.status(400).send('Message is required');
  }
});



postRouter.post('/:id', (req, res, next) => {
  let body = req.body;
  if(body.Message){
    makePost(req.body.Message, req.params.id, res.locals.UserId, (err, id)=> {
      if(err){
        return res.status(400).send(err);
      } else{
        return res.status(200).send(id);
      }
    });
  } else {
    return res.status(400).send('Message is required');
  }
});


module.exports = postRouter;
