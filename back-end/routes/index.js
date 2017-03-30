const express = require('express');
const path = require('path');
const multer = require('multer');
const DB = require('../helpers/db');
const router = express.Router();
let multiparty = require('multiparty');
let fs = require('fs');

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

  const password = req.body.data.password;
  const session = req.session;
  const email = req.body.data.email;
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
          res.status(500).send({ error: "internal server error" });
          return;
        }
        if (results1.rowCount) {
          session.user_id = results1.rows[0].user_id;
          let data = {
          userId: session.user_id
        }
          res.status(201).send((data));
        }
      });
    }
  });
});

router.post('/register', upload.single('profile'), (req, res, next) => {
  console.log(req.body);
  const username = req.body.data.username;
  const email = req.body.data.email;
  const mobilenumber = req.body.data.mobilenumber;
  const password = req.body.data.password;

    const query1 = DB.builder()
    .insert()
    .into('users')
    .set('username', username)
    .set('email', email)
    .set('image', "null")
    .set('mobilenumber', mobilenumber)
    .set('password', password)
    .toParam();

    DB.executeQuery(query1, (error , data) => {
      if (error) {
        next(error);
        res.status(500).send({ error: "internal server error" });
        return;
      }
      const query1 = DB.builder()
      .select()
      .from('users')
      .order("user_id", false)
      .limit(1)
      .toParam();
    DB.executeQuery(query1, (error, results) => {
      if (error) {
        next(error);
        return;
      }
      let object={
        userId : results.rows[0].user_id
      }
      console.log("++++++",results)
      console.log("========",object)
      res.status(201).send(object);
    });


    });
});

router.post('/tweet', upload.single('imagetweet'), (req, res, next) => {

  const userId = req.body.userId;
  const tweet = req.body.tweet;
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
    console.log(object);
  res.status(201).send(object);
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

router.get('/user/:Id', (req, res, next) => {
  userId = req.params.Id;
  const session = req.session;
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
            res.status(201).send(object);
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
           res.status(201).send(object);
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
  const follower_id = req.body.followerId;
  const login_user_id = req.body.data;
  const query = DB.builder()
  .insert()
  .into('follower')
  .set('login_user_id', login_user_id)
  .set('follower_id', follower_id)
  .toParam();
  DB.executeQuery(query, (error) => {
    if (error) {
      next(error);
      return;
    }

    const query1 = DB.builder()
      .select()
      .from('follower')
      .order("id", false)
      .limit(1)
      .toParam();
    DB.executeQuery(query1, (error, results) => {
      if (error) {
        next(error);
        return;
      }

    let object={
        "userId" : login_user_id,
        "lastid" : results.rows[0].id,
      }
      res.status(201).send((object));
    });
  });
});

router.post('/unfollow', (req, res, next) => {
  const id = req.body.followerId;
  const userId = req.body.data;
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
      res.status(201).send(object);
  });
});

router.post('/profilepictureupload', (req, res, next) => {

  // console.log("+++++++++",req.file);

  // const userId = req.body.userdata.results[0].user_id;
  // const originalFilename =

  // let photo = '';
  // if (req.body) {
  //   photo = req.body.file.name;
  // } else {
  //   photo = '';
  // }
  // const query = DB.builder()
  // .update()
  // .table('users')
  // .set('image', photo)
  // .where('user_id = ?',userId)
  // .toParam();
  // DB.executeQuery(query, (error) => {
  //   if (error) {
  //     next(error);
  //     return;
  //   }

  //   res.end();
  // });
});

router.post('/upload/:Id', (req, res, next) => {
  // console.log("----",req);
  console.log("header is", req.headers.referer);
  var url = req.headers.referer;
  var a = url.split("/");
  // console.log(a[4]);
  let form = new multiparty.Form();
 let userId = a[4];
  let photo = '';
  form.parse(req, (err, fields, files) => {
    console.log("=======>",files)
    let {path: tempPath, originalFilename} = files.imageFile[0];
    let newPath = '/Users/parita/Twittwe-clone/public/images/'+ originalFilename;
    console.log("image:",originalFilename);
    let copyToPath = "/Users/parita/Twittwe-clone/public/images" + originalFilename;
    console.log("copyPath:", copyToPath)
    fs.readFile(tempPath, (err, data) => {
      // make copy of image to new location
      fs.writeFile(newPath, data, (err) => {
        // delete temp image
        fs.unlink(tempPath, () => {

          res.send(`File uploaded to: ${newPath}`);
          if (req) {
            photo = originalFilename;
          } else {
            photo = '';
          }
          const query = DB.builder()
          .update()
          .table('users')
          .set('image', photo)
          .where('user_id = ?', userId)
          .toParam();
          DB.executeQuery(query, (error) => {
            if (error) {
              next(error);
              return;
            }

            res.end();
          });
        });
      });
    });
  });
});
// router.post('/editprofile', (req, res, next) => {
//   const session = req.session;
//   const username = req.body.username;
//   const email = req.body.email;
//   const mobileno = req.body.mobileno;
//   let password = '';
//   if (req.body.confirmpassword !== '') {
//     password = req.body.confirmpassword;
//   } else {
//     password = req.body.password;
//   }
//   const query = DB.builder()
//   .update()
//   .table('users')
//   .set('username', username)
//   .set('email', email)
//   .set('mobilenumber', mobileno)
//   .set('password', password)
//   .where('user_id = ?', session.user_id)
//   .toParam();
//   DB.executeQuery(query, (error) => {
//     if (error) {
//       next(error);
//       return;
//     }
//     res.redirect('/welcome');
//   });
// });
module.exports = router;
