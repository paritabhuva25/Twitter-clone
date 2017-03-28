import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router'
import App from './App';
import App1 from './App1';
import './index.css';
import Register from './Register.js'
import Login from './Login.js'
import welcome from './welcome.js'
import Profile from './profile.js'
import Followers from './followers.js'
ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={App1}>
      <Route path="/Register" component={Register}/>
      <Route path="/Login" component={Login}/>
    </Route>
    <Route path="/" component={App}>
      <Route path="/user/:Id" component={welcome}/>
      <Route path="/logout" component={Login}/>
      <Route path="/profile/:Id" component={Profile}/>
      <Route path="/tweet" component={welcome}/>
      <Route path="/follow" component={welcome}/>
      <Route path="/unfollow" component={Profile}/>
      <Route path="/followers/:Id" component={Followers}/>
    </Route>
  </Router>,
document.getElementById('root'))

