const request = require('supertest');
const should = require('should');
const app = require('../app');


const data = {
  data: {
    user_id: 30,
    username: 'test',
    mobilenumber: 1234567890,
    email: 'test@improwised.com',
    password: 'test',
    profile: 'test.jpg',
    unfollowId: '',
  },
};
describe('POST/register', function () {
  it('it should response login.pug page', (done) => {
    request(app)
    .post('/register')
    .send(data)
    .expect(201)
    .end((err, res) => {
      if (err) {
        done(err);
      } else {
        res.status.should.be.equal(201);
        done();
      }
    });
  });
});

describe('POST/login', function () {
  it('it should response welcome.pug page', (done) => {
    request(app)
    .post('/login')
    .send(data)
    .expect(201)
    .end((err, res) => {
      (res.status.should.be.equal(201));
      done();
    });
  });
});

describe('GET/logout', function () {
  it('it should response login', (done) => {
    request(app)
    .get('/logout')
    .expect(200, done);
  });
});

describe('GET/user/30', function () {
  it('it should response user detail page', (done) => {
    this.timeout(500);
    setTimeout(done, 300);
    request(app)
    .get(`'/user/' ${data.data.user_id}`)
    .expect('Content-type', '/json/')
    .end(function (err, res) {
      res.body.results[0].user_id.should.be.equal(data.data.user_id);
      done();
    });
  });
});

describe('GET /profile/30', function () {
  it('it should response login.pug page', (done) => {
    this.timeout(500);
    setTimeout(done, 300);
    request(app)
    .get(`'/profile/' ${data.data.user_id}`)
    .expect('Content-type', '/json/')
    .end(function (err, res) {
      res.body.results[0].user_id.should.be.equal(data.data.user_id);
      done();
    });
  });
});

describe('POST/tweet', function () {
  it('it should response welcome.pug page', (done) => {
    const users = {
      userId: data.data.user_id,
      tweet: 'parita',
      imagetweet: 'dog.jpg',
    };
    request(app)
    .post('/tweet')
    .send(users)
    .expect(201)
    .end((err, res) => {
      if (err) {
        done(err);
      } else {
        res.status.should.be.equal(201);
        done();
      }
    });
  });
});

describe('POST/follower', function () {
  it('it should response welcome.pug page', (done) => {
    const users = {
      data: data.data.user_id,
      followerId: 1,
    };
    request(app)
    .post('/follower')
    .send(users)
    .expect(201)
    .end((err, res) => {
      if (err) {
        done(err);
      } else {
        data.data.unfollowId = res.body.lastid;
        res.status.should.be.equal(201);
        done();
      }
    });
  });
});
describe('POST/unfollow', function () {
  it('it should response profilechange.pug page', (done) => {
    const users = {
      followerId: data.data.unfollowId,
    };
    request(app)
    .post('/unfollow')
    .send(users)
    .expect(201)
    .end((err, res) => {
      if (err) {
        done(err);
      } else {
        res.status.should.be.equal(201);
        done();
      }
    });
  });
});

