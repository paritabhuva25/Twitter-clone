import React, { Component } from 'react';
import './NevigationBar.css';
import logo from '../public/logo.png';

class Navlogin extends Component{

  render() {

   return(
    <div>
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
              <li><a href="/register">Register</a></li>
              <li><a href="/Login">Login</a></li>
              <li><a href="https://twitter.com/about">About us</a></li>
            </ul>
          </div>
        </div>
      </nav>
      </div>
    );
  }
}
export default Navlogin;
