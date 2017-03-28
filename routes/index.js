const express = require('express');
const path = require('path');
const multer = require('multer');
const DB = require('../helpers/db');
const router = express.Router();

const upload = multer({ dest: path.resolve(__dirname, '../public/images/') });
router.get('/followers', (req, res) => {
  const session = req.session;
  let query;
  if (session.user_id) {
    query = DB.builder()
    .select()
    .from('users')
    .where('user_id = ?', session.user_id)
    .toParam();
    DB.executeQuery(query, (error, results) => {
      if (error) {
        next(error);
        return;
      }
      query = DB.builder()
      .select()
      .field('username')
      .field('follower_id')
      .field('user_id')
      .field('image')
      .field('id')
      .from('users', 'r')
      .join(DB.builder()
      .select()
      .from('follower'), 'f', 'r.user_id = f.follower_id')
      .where('login_user_id = ?', session.user_id)
      .toParam();
      DB.executeQuery(query, (errorresults, users) => {
        if (errorresults) {
          next(errorresults);
          return;
        }
        query = DB.builder()
        .select()
        .from('follower')
        .where('login_user_id = ?', session.user_id)
        .toParam();
        DB.executeQuery(query, (errorusers, c) => {
          if (errorusers) {
            next(errorusers);
            return;
          }
          res.render('followers', {
            count: c.rows.length,
            users: users.rows,
            results: results.rows,
          });
        });
      });
    });
  } else {
    res.redirect('/login');
  }
});

router.post('/login', (req, res, next) => {

  const password = req.body.userdata.password;
  const session = req.session;
  const email = req.body.userdata.email;
  let query;
  query = DB.builder()
  .select()
  .from('users')
  .where('email = ?', email)
  .toParam();
  DB.executeQuery(query, (error, results) => {
    if (error) {
      next(error);
      return;
    }
    if (results.rowCount) {
      query = DB.builder()
      .select()
      .from('users')
      .where('email = ?',  email)
      .where('password = ?', password)
      .toParam();
      DB.executeQuery(query, (err, results1) => {
        if (err) {
          next(err);
          return;
        }
        if (results1.rowCount) {
          session.user_id = results1.rows[0].user_id;
        }
      let data = {
        userId: session.user_id,
      }
     res.end(JSON.stringify(data));
     //res.cookie("cookie" ,"value").send('Cookie is set');
   });
  }
});
});

router.get('/', (req, res) => {
  res.render('index');
});


router.post('/register', upload.single('profile'), (req, res, next) => {
  const username = req.body.userdata.username;
  const email = req.body.userdata.email;
  const mobilenumber = req.body.userdata.mobilenumber;
  const password = req.body.userdata.password;
  const image = req.body.userdata.profile;

    const query1 = DB.builder()
    .insert()
    .into('users')
    .set('username', username)
    .set('email', email)
    .set('image', image)
    .set('mobilenumber', mobilenumber)
    .set('password', password)
    .toParam();

    DB.executeQuery(query1, (error , data) => {
      if (error) {
        next(error);
        return;
      }
      console.log("====>",data);
      let object={
          data: data.rows
      }
      res.end( JSON.stringify(object));
    });
});

router.post('/tweet', upload.single('imagetweet'), (req, res, next) => {
  // console.log(req);
  // return false;
  const userId = req.body.data.data.results[0].user_id;
  const tweet = req.body.data.tweet;

  // req.check('tweet', 'Tweet is required').notEmpty();
  // var errors = req.validationErrors();
  // console.log(errors);
  if (tweet == "" || tweet == null) {
   let object={
        "status" : "0",
        "userId" : userId,
        "error" : "Please Enter Tweet",
      }
    console.log(object);
    // return false;
    res.send(JSON.stringify(object));
    return;
   }

    let photo = '';
    if (req.file) {
      photo = req.file.data.imagetweet;
    } else {
      photo = '';
    }
    const query = DB.builder()
    .insert()
    .into('tweet')
    .set('tweet', tweet)
    .set('userid', userId)
    .set('imagetweet', photo)
    .toParam();

    DB.executeQuery(query, (error ,data) => {
      if (error) {

        next(error);
        return;
      }
      let object={
        "userId" : userId
      }
      res.send(JSON.stringify(object));
    });

});

router.get('/deletetweet/:id', (req, res, next) => {
  const tweetid = req.params.id;
  const query = DB.builder()
  .delete()
  .from('tweet')
  .where('id = ?', tweetid)
  .toParam();
  DB.executeQuery(query, (error) => {
    if (error) {
      next(error);
      return;
    }
    res.redirect('/profilechange');
  });
});

router.get('/logout', (req, res) => {
  const session = req.session;
    req.session.destroy(() => {
    res.end();
  });
});
router.get('/profileuser/:id', (req, res, next) => {
  const profileid = req.params.id;
  let query;
      query = DB.builder()
      .select()
      .from('users')
      .where('user_id = ?', profileid)
      .toParam();
      DB.executeQuery(query, (error, profile) => {
        if (error) {
          next(error);
          return;
        }
        query = DB.builder()
          .select()
          .field('tweet')
          .field('time')
          .field('username')
          .field('image')
          .field('imagetweet')
          .field('user_id')
          .field('id')
          .from('tweet', 't')
          .join(DB.builder()
          .select()
          .from('users'), 'u', 't.userid = u.user_id')
          .where('user_id = ?', profileid)
          .order('time', false)
          .toParam();
          DB.executeQuery(query, (errorusers, tweets) => {
            if (errorusers) {
              next(errorusers);
              return;
            }
            query = DB.builder()
            .select()
            .from('follower')
            .where('login_user_id = ?', profileid)
            .toParam();
            DB.executeQuery(query, (errorusers, c) => {
              if (errorusers) {
                next(errorusers);
                return;
              }

              let object= {
               profile: profile.rows[0],
                count: c.rows.length,
                tweets: tweets.rows,
              }

               res.end( JSON.stringify(object));

            });
          });
      });
});

router.get('/user/:Id', (req, res, next) => {
  userId = req.params.Id;
  const session = req.session;
  console.log("====",userId)
  let query;
  if (userId) {
    query = DB.builder(
      )
    .select()
    .from('users')
    .where('user_id = ?', userId)
    .toParam();
    DB.executeQuery(query, (error, results) => {
      if (error) {
        next(error);
        return;
      }

      query = DB.builder()
      .select()
      .from('users')
      .where('user_id != ?', userId)
      .where('user_id NOT IN ?',
      DB.builder()
      .select()
      .field('follower_id')
      .from('follower')
      .where('login_user_id = ?', userId))
      .toParam();
      DB.executeQuery(query, (errorresults, follow) => {
        if (errorresults) {
          next(errorresults);
          return;
        }
        query = DB.builder()
        .select()
        .field('username')
        .field('tweet')
        .field('imagetweet')
        .field('time')
        .field('id')
        .field('user_id')
        .field('image')
        .from('users', 'u')
        .join(DB.builder().select().from('tweet'), 't', 'u.user_id = t.userid')
        .where('u.user_id IN ? OR u.user_id= ? ',
        (DB.builder()
        .select()
        .field('follower_id')
        .from('follower')
        .where('login_user_id = ?', userId)), userId)
        .order('time', false)
        .toParam();
        DB.executeQuery(query, (errorfollow, tweets) => {
          if (errorfollow) {
            next(errorfollow);
            return;
          }
          query = DB.builder()
          .select()
          .from('follower')
          .where('login_user_id = ?', userId)
          .toParam();
          DB.executeQuery(query, (errortweets, c) => {
            if (errortweets) {
              next(errortweets);
              return;
            }

            let object={
              count: c.rows.length,
              follow: follow.rows,
              results: results.rows,
              tweets: tweets.rows,
            }
            res.end( JSON.stringify(object));
          });
        });
      });
    });
  }
});

router.get('/profile/:Id', (req, res, next) => {
  userId = req.params.Id;
  const session = req.session;
  let query;
  if (userId) {
    query = DB.builder()
    .select()
    .from('users')
    .where('user_id = ?', userId)
    .toParam();
    DB.executeQuery(query, (error, results) => {
      if (error) {
        next(error);
        return;
      }
      query = DB.builder()
      .select()
      .field('username')
      .field('follower_id')
      .field('login_user_id')
      .field('image')
      .field('id')
      .from('users', 'r')
      .join(DB.builder()
      .select()
      .from('follower'), 'f', 'r.user_id = f.follower_id')
      .where('login_user_id = ?', userId)
      .toParam();
      DB.executeQuery(query, (errorresults, users) => {
        if (errorresults) {
          next(errorresults);
          return;
        }
        query = DB.builder()
        .select()
        .field('tweet')
        .field('time')
        .field('username')
        .field('image')
        .field('imagetweet')
        .field('user_id')
        .field('id')
        .from('tweet', 't')
        .join(DB.builder()
        .select()
        .from('users'), 'u', 't.userid = u.user_id')
        .where('user_id = ?', userId)
        .order('time', false)
        .toParam();
        DB.executeQuery(query, (errorusers, tweets) => {
          if (errorusers) {
            next(errorusers);
            return;
          }
          query = DB.builder()
          .select()
          .from('follower')
          .where('login_user_id = ?', userId)
          .toParam();
          DB.executeQuery(query, (errortweets, c) => {
            if (errortweets) {
              next(errortweets);
              return;
            }
            let object={
              count: c.rows.length,
              tweets: tweets.rows,
              users: users.rows,
              results: results.rows,
            }

            res.end( JSON.stringify(object));

          });
        });
      });
    });
  }
});

router.get('/profilepictureupload', (req, res, next) => {
  const session = req.session;
  let query;
  if (session.user_id) {
    query = DB.builder()
    .select()
    .from('users')
    .where('user_id = ?', session.user_id)
    .toParam();
    DB.executeQuery(query, (error, results) => {
      if (error) {
        next(error);
        return;
      }
      res.end( JSON.stringify(results.rows));

    });
  }
});

router.post('/follower', (req, res, next) => {
  const id = req.body.followerId;
  const userId = req.body.data.data.results[0].user_id;
  const query = DB.builder()
  .insert()
  .into('follower')
  .set('login_user_id', userId)
  .set('follower_id', id)
  .toParam();
  DB.executeQuery(query, (error) => {
    if (error) {
      next(error);
      return;
    }
    let object={
        "userId" : userId
      }
      res.send(JSON.stringify(object));
  });
});

router.post('/unfollow', (req, res, next) => {
  const id = req.body.followerId;
  console.log("======",id);
  const userId = req.body.data.data.results[0].user_id;
  const query = DB.builder()
  .delete()
  .from('follower')
  .where('id = ?', id)
  .toParam();
  DB.executeQuery(query, (error) => {
    if (error) {

      next(error);
      return;
    }
   let object={
        "userId" : userId
      }
      res.send(JSON.stringify(object));
  });
});

router.post('/profilepictureupload', upload.single('thumbnail'), (req, res, next) => {
  const session = req.session;
  let photo = '';
  if (req.file) {
    photo = req.file.filename;
  } else {
    photo = '';
  }
  const query = DB.builder()
  .update()
  .table('users')
  .set('image', photo)
  .where('user_id = ?', session.user_id)
  .toParam();
  DB.executeQuery(query, (error) => {
    if (error) {
      next(error);
      return;
    }

    res.redirect('/profilechange');
  });
});

router.post('/editprofile', (req, res, next) => {
  const session = req.session;
  const username = req.body.username;
  const email = req.body.email;
  const mobileno = req.body.mobileno;
  let password = '';
  if (req.body.confirmpassword !== '') {
    password = req.body.confirmpassword;
  } else {
    password = req.body.password;
  }
  const query = DB.builder()
  .update()
  .table('users')
  .set('username', username)
  .set('email', email)
  .set('mobilenumber', mobileno)
  .set('password', password)
  .where('user_id = ?', session.user_id)
  .toParam();
  DB.executeQuery(query, (error) => {
    if (error) {
      next(error);
      return;
    }
    res.redirect('/welcome');
  });
});

module.exports = router;
