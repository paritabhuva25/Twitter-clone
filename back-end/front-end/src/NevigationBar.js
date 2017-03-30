import React, { Component } from 'react';
import './NevigationBar.css';
import logo from '../public/logo.png';
import axios from 'axios'
import {browserHistory} from 'react-router';
import cookie from 'react-cookie';

class NevigationBar extends Component{
  constructor(props) {
    super(props);
    this.onclick = this.onclick.bind(this);
  }

  onclick(e) {
    let id = this.props.params.Id;
    axios.get('http://localhost:8000/logout', {
      userdata: this.state,
    })
    .then(function (response) {
      cookie.remove(id, { path: '/' });
      browserHistory.push('/login');
    })
    .catch(function (error) {
      console.log(error);
    });
      e.preventDefault(e);
  }

  render() {
    return(
      <nav className="navbar navbar-default">
        <div className="container-fluid">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a href="/"><img className="logo" src={logo} alt="logo"/></a>
          </div>

          <div className="collapse navbar-collapse " id="bs-example-navbar-collapse-1">
            <ul className="nav navbar-nav navbar-right navigation">
              <li><a href="/">Twitter</a></li>
              <li><a href="/Login" onClick={this.onclick} >Logout</a></li>
              <li><a href="#">About us</a></li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}
export default NevigationBar;
