import React, { Component } from 'react';
import cookie from 'react-cookie';
import {browserHistory} from 'react-router';
import axios from 'axios';
import './profile.css';

class Profile extends Component{

  constructor(props) {
    super(props);
    this.state={
      data:'',
    }
    this.onFieldChange = this.onFieldChange.bind(this);
    this.onsubmittweet = this.onsubmittweet.bind(this);
    this.onunfollow = this.onunfollow.bind(this);
    this.onHomeClick = this.onHomeClick.bind(this);
    this.onfollowerCLick = this.onfollowerCLick.bind(this);
  }

  componentWillMount() {
    if(cookie.load(this.props.params.Id)){
    let userId = cookie.load(this.props.params.Id);
    axios.get('http://localhost:8000/profile/' + userId)
    .then(res => {
      const data= res.data;
      this.setState({
        data: data,
      })
    });
    }
  }
  onsubmittweet(e){
    axios.post('http://localhost:8000/tweet', {
      data : this.state,
    })
    .then(function (response) {
      if (response.data.userId) {
        location.reload();
        browserHistory.push("/profile/" + response.data.userId)
      }
    })
    .catch(function (error) {
    });
    e.preventDefault(e);
    this.setState({
      showComponent: true,
    });
  }
  onunfollow(id) {
    axios.post('http://localhost:8000/unfollow', {
      data : this.state,
      followerId: id,
    })
    .then(function (response) {
      if (response.data.userId) {
        location.reload();
        browserHistory.push("/user/" + response.data.userId)
      } else {
          browserHistory.push("/user/" + response.data.userId)
      }
    })
    .catch(function (error) {

    });
    //e.preventDefault(e);
  }

  onFieldChange(event){
    this.setState({
      [ event.target.name]: event.target.value
    });
  }
  onHomeClick(e) {

    let userId = this.props.params.Id
      if(userId)
        browserHistory.push("/user/" +userId)
      else
        browserHistory.push("/login")
    e.preventDefault(e);
  }
  onfollowerCLick(e){

    let userId = this.props.params.Id
      if(userId)
        browserHistory.push("/followers/" +userId)
      else
        browserHistory.push("/login")
    e.preventDefault(e);
  }
  render() {
    var tweet = [];
     if(this.state.data.count) {

      for (var i = 0; i < this.state.data.tweets.length ; i++) {
        if(this.state.data.tweets[i].imagetweet) {
          let image = '', imagetweet='' ;
          image = `http://localhost:8000/images/${this.state.data.tweets[i].image}`
          imagetweet = `http://localhost:8000/images/${this.state.data.tweets[i].imagetweet}`;
          tweet.push(
            <div key={i} className="media block-update-card center" style={{margin: "10px auto",width: "100%",}}>
              <p className="pull-left">
                <img src={image }
                alt="sss"
                height="50px"
                width="50px"
                className="img-circle media-object"/>
              </p>
              <div className="pull-right"  style={{margin: "10px 10px",}}>
                {this.state.data.tweets[i].time}
              </div>
              <div key={i} className="media-body update-card-body">
                <p className="media-heading"> {this.state.data.tweets[i].username}</p>
                <div  key={i}> {this.state.data.tweets[i].tweet} </div>
                <img
                  src={imagetweet}
                  alt="aaa"
                  height="250px"
                  width="250px"
                  className="media-object"/>
                <p></p>
              </div>
            </div>
          );
        }else {
        let image = ''
        image = `http://localhost:8000/images/${this.state.data.tweets[i].image}`
        tweet.push(
        <div key={i} className="page-canvas" >
          <div key={i} className="media block-update-card center" style={{margin: "10px auto",width: "100%",height:"100px"}}>
            <a href="#" className="pull-left">
              <img src={ image }
              alt="sss"
              height="50px"
              width="50px"
              className="img-circle media-object "/>
            </a>
            <div className="pull-right"  style={{margin:" 5px 5px",}}>
                {this.state.data.tweets[i].time}
              </div>
            <div key={i} className="media-body update-card-body">
              <a href="/profile/" className="media-heading">{this.state.data.tweets[i].username}</a>
              <div  key={i}> {this.state.data.tweets[i].tweet} </div>
            </div>
          </div>
        </div>
          );

      }
    }
  }
    var follower = [];

    if(this.state.data.users) {
      let image = ''

       for ( i = 0; i < this.state.data.users.length ; i++) {

        if(this.state.data.users) {
          let a = this.state.data.users[i].id;
          image = `http://localhost:8000/images/${this.state.data.users[i].image}`
          follower.push(
             <div key={i} className="media block-update-card right center-block" style={{height:"250px",width: "60%",}}>
                  <img name="profile"
                  src={ image }
                  alt="www"
                  height="150px"
                  width="150px"
                  className="img-circle center-block"/>
                  <h5 className="h5">{this.state.data.users[i].username}</h5>
                  <form  >
                    <input
                      value={a}
                      type="hidden"
                      name="followerId"/>
                    <input
                      onClick={this.onunfollow.bind(this, a)}
                      id={a}
                      type="submit"
                      value="UnFollow"
                      className="btn-sm btn-info waves-effect waves-light center-block"/>
                  </form>
                </div>
          );
        }
      }
    }
     let username = '' , profileimage = '';
    if(this.state.data.results){
      profileimage = `http://localhost:8000/images/${this.state.data.tweets[0].image}`
      username = this.state.data.results[0].username;
    }
    return(
    <div>
      <div className="container">
        <div className="fb-profile ">
            <img
            className="fb-image-lg"
            src={require(`../../public/images/cover.jpg`)}
            alt="Profile example"/>
            <img
            className="fb-image-profile thumbnail"
            src={profileimage}
            alt="Profile example"/>
            <div className="fb-profile-text">
                <h1>{username}</h1>

            </div>

        </div>
      </div>
      <div className="container">
        <div className="page-canvas">
          <div className="row">
           <div className="col-sm-3">
            <div className="profile-usermenu">
              <ul className="nav">
                <li className="active">
                  <a href="#">
                    <i className="glyphicon glyphicon-user"> Profile</i>
                  </a>
                </li>
                <li>
                  <a onClick={this.onHomeClick}>
                    <i className="glyphicon glyphicon-home"> home</i>
                  </a>
                </li>
                <li>
                  <a onClick={this.onfollowerCLick}>
                    <i className="glyphicon glyphicon-ok"> folllowers &nbsp;&nbsp;&nbsp;</i>
                      <span className="badge">{this.state.data.count}</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="profile-content">
              <div className="row">
                <p className="align"><i className="glyphicon glyphicon-pencil">&nbsp;
                </i>Your Tweets are  here  !!</p>
                 <hr/>
              </div>
              <div className="row">
                { tweet }
              </div>
            </div>
          </div>
          <div className="col-sm-3">
            <div className="profile-content">
              <div className="sidebar-menu">
                <p>
                  <i className="glyphicon glyphicon-user">&nbsp;
                  </i>
                  Your followers are here !!!1
                </p>
                <hr/>
                <div className="row">
                {follower}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


    );
  }
}
export default Profile;
