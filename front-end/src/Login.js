import React, { Component } from 'react';
import './Login.css';
import {browserHistory} from 'react-router';
import cookie from 'react-cookie';
import axios from 'axios';
import { HelpBlock } from 'react-bootstrap';

class Login extends Component{
  constructor(props) {
    super(props);
    this.state={
      userid :'',
      email :'',
      password :'',
      usernamerequirederrors :'',
      passwordrequirederrors :'',
      data:'' ,
    }
    this.onFieldChange = this.onFieldChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e){
    this.setState({
      usernamerequirederrors :'',
      passwordrequirederrors :'',
    });
    let status = true;

    if(this.state.email === '') {
      console.log("before:", status);
      this.setState({usernamerequirederrors: '*Required'});
      status = false;
    }

    if(this.state.password ==='') {
      this.setState({passwordrequirederrors: '*Required'})
      status = false;
    }

    if(status) {
      axios.post('http://localhost:8000/login', {
        data: this.state,
      })
      .then(function (response) {
        cookie.save(response.data.userId, response.data.userId, { path: '/' });
        if (response.data.userId) {
          browserHistory.push("/user/" + response.data.userId)
        } else {
          browserHistory.push("/login")
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    } else {
      browserHistory.push("/login")
    }
    e.preventDefault(e);
  }

  onFieldChange(event){
    this.setState({
      [ event.target.name]: event.target.value
    });
  }

  render() {
    return(
      <div className="container">
        <form className="form-horizontal page-canvas">
          <div className="signin-wrapper form logbox">
            <div className="form-group">
              <div className="col-md-12">
                <h2>Log in to Twitter</h2>
              </div>
            </div>
            <div className="form-group">
              <div className="col-md-12">
                <input
                value={this.state.email}
                onChange={this.onFieldChange}
                className="form-control"
                id="inputEmail3"
                type="text"
                name="email"
                placeholder="Email"/>
                <HelpBlock className="errFontStyle"> {this.state.usernamerequirederrors} </HelpBlock>
              </div>
              <div className="col-md-12">
              </div>
            </div>
            <div className="form-group">
              <div className="col-md-12">
                <input
                value={this.state.password}
                onChange={this.onFieldChange}
                className="form-control"
                id="inputPassword3"
                type="password"
                name="password"
                placeholder="Password"/>
                <HelpBlock className="errFontStyle"> {this.state.passwordrequirederrors} </HelpBlock>
              </div>
              <div className="col-md-12">
              </div>
            </div>
            <div className="form-group">
              <div className="col-md-12">
                <input className="filled-in" type="checkbox" name="remember_me" value="1"  required="required"/>
                <label>Remember me<span className="separator">&middot;&nbsp;</span>
                </label>
                <input
                className="form-control button btn-info"
                type="submit" name="Submit"
                onClick={this.handleSubmit}
                value="Log In"/>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
export default Login;
