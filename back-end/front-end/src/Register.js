import React, { Component } from 'react';
import './Register.css';
import { HelpBlock } from 'react-bootstrap'
import axios from 'axios';
import { browserHistory } from 'react-router';




class Register extends Component{
  constructor(props) {
    super(props);
    this.state={
      userId : '',
      username :'',
      email :'',
      mobilenumber:'',
      password :'',
      confirmpassword :'',
      profile:'',
      usernamerequirederrors :'',
      emailrequirederrors :'',
      mobilenumberrequirederrors:'',
      passwordrequirederrors :'',
      confirmpasswordrequirederrors :'',
      profilerequirederrors:'',
      data:'' ,
    }
    this.onFieldChange = this.onFieldChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e){
    this.setState({
      usernamerequirederrors :'',
      emailrequirederrors: '',
      mobilenumberrequirederrors:'',
      passwordrequirederrors :'',
      confirmpasswordrequirederrors :'',
      profilerequirederrors:'',
    });

    let status = true;
    if(this.state.username === '') {
      this.setState({usernamerequirederrors: '*Required'});
      status = false;
    }
    if(this.state.email === '') {
      this.setState({emailrequirederrors: '*Required'})
      status = false;
    }
    if(this.state.mobilenumber === '') {
      this.setState({mobilenumberrequirederrors: '*Required'})
      status = false;
    }
    if(this.state.password === '') {
      this.setState({passwordrequirederrors: '*Required'})
      status = false;
    }
    if(this.state.confirmpassword !== this.state.password ) {
      this.setState({confirmpasswordrequirederrors: '*Both paasword must be same .'})
      status = false;
    }
    if(this.state.profile === '') {
      this.setState({profilerequirederrors: '*Required'})
      status = false;
    }
    if(status){
    axios.post('http://localhost:8000/register', {
       data: this.state,
    })

    .then(function (response) {
      console.log(response.data.userId);

      browserHistory.push('/upload/'+response.data.userId);
    })


      e.preventDefault(e);
    }
  }
  onFieldChange(event){

    this.setState({
      [ event.target.name]: event.target.value
    });
  }

  render() {


    return(

      <div className="container">
  <div className="col-md-12 page-canvas">
    <div className="signin-wrapper form logbox">
      <h2>Join twitter Today!!</h2>

      <form className="form-horizontal">
        <div className="form-content">
          <div className="form-group">
            <div className="col-sm-12">

              <input
              value={this.state.username}
              onChange={this.onFieldChange}
              className="form-control form-control-inline"
              type="text"
              id="name"
              name="username"
              placeholder="username"
              required/>
              <HelpBlock className="errFontStyle"> {this.state.usernamerequirederrors} </HelpBlock>
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-12">
              <input
              value={this.state.mobilenumber}
              onChange={this.onFieldChange}
              className="form-control form-control-inline"
              type="text"
              name="mobilenumber"
              maxLength="10"
              placeholder="Mobile Number"
              required="required"/>
              <HelpBlock className="errFontStyle"> {this.state.mobilenumberrequirederrors} </HelpBlock>
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-12">
              <input
              value={this.state.email}
              onChange={this.onFieldChange}
              className="form-control form-control-inline"
              type="email"
              name="email"
              placeholder="email"
              required="required"/>
              <HelpBlock className="errFontStyle"> {this.state.emailrequirederrors} </HelpBlock>
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-12">
              <input
              value={this.state.password}
              onChange={this.onFieldChange}
              className="form-control form-control-inline"
              type="password"
              id="password"
              name="password"
              placeholder="password"
              required="required"/>
              <HelpBlock className="errFontStyle"> {this.state.passwordrequirederrors} </HelpBlock>
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-12">
              <input
              value={this.state.confirmpassword}
              onChange={this.onFieldChange}
              className="form-control form-control-inline"
              type="password"
              id="confirmPassword"
              name="confirmpassword"
              placeholder="Confirm password"
              required="required"/>
              <HelpBlock className="errFontStyle"> {this.state.confirmpasswordrequirederrors} </HelpBlock>
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-12">
              <input className="form-control button btn-info" type="button" onClick={this.handleSubmit} name="Submit" value="Sign In"/>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</div>
    );
  }
}
export default Register;
