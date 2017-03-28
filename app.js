const http = require('http');
const path = require('path');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');

const expressValidator = require('express-validator');



// Load dotenv config
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line global-require
  require('dotenv').load();

  if (!process.env.PORT) {
    // console.error(`Required environment variable not found. Are you sure you
    //   have a ".env" file in your application root?`);
    // console.error(`If not, you can just copy "example.env" and change the
    //   defaults as per your need.`);
    process.exit(1);
  }
}

const routes = require('./routes');

const app = express();

const server = http.createServer(app);

app.use(cors());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressValidator());
// app.use(busboybodyParser({ limit: '5mb' }));

app.use(session({
  secret: 'password',
  resave: true,
  saveUninitialized: true,
  cookie: { httpOnly: false }
}));

app.use('/', routes);
app.use('/login', routes);
app.use('/logout', routes);
app.use('/tweet', routes);
app.use('/retrive_password', routes);
app.use('/register', routes);
app.use('/welcome', routes);
app.use('/profilechange', routes);
app.use('/profilepictureupload', routes);
app.use('/editprofile', routes);
// Catch 404 errors
// Forwarded to the error handlers
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Development error handler
// Displays stacktrace to the user
if (app.get('env') === 'development') {
  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
    });
  });
}

// Production error handler
// Does not display stacktrace to the user
app.use((err, req, res) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: '',
  });
});

server.listen(process.env.PORT);
// console.log(`Server started on port ${process.env.PORT}`);
module.exports = app;
