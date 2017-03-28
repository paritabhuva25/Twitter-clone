import React, { Component } from 'react';
import './welcome.css';
import cookie from 'react-cookie';
import axios from 'axios';
import {browserHistory} from 'react-router';
import { HelpBlock } from 'react-bootstrap';

class welcome extends Component{
  constructor(props) {
    super(props);
    this.state=
    {
      tweet : '',
      imagetweet : '',
      data:'',
      twitted:false,
      tweetrequired:'',
    }
    this.onFieldChange = this.onFieldChange.bind(this);
    this.onProfileClick = this.onProfileClick.bind(this);
    this.onsubmittweet = this.onsubmittweet.bind(this);
    this.onfollow = this.onfollow.bind(this);
    this.onfollowerCLick = this.onfollowerCLick.bind(this);
  }

  componentWillMount() {
    if(cookie.load(this.props.params.Id)) {
      let userId = cookie.load(this.props.params.Id);
      axios.get('http://localhost:8000/user/' + userId)
      .then(res => {
        const data= res.data;
        this.setState({
          data: data,
        })
      });
    } else {
      browserHistory.push('/login');
    }
  }
  onfollow(id) {
    axios.post('http://localhost:8000/follower', {
      data : this.state,
      followerId: id,
    })
    .then(function (response) {
      if (response.data.userId) {
        location.reload();
        browserHistory.push("/user/" + response.data.userId)
      }
    })
    .catch(function (error) {

    });


  }
  onProfileClick(e) {
    let userId = this.props.params.Id
      if(userId)
        browserHistory.push("/profile/" +userId)
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
  onsubmittweet(e){
    e.preventDefault(e);
    let status = true;
    if(this.state.tweet === ''){
      this.setState({tweetrequired: '*Required'});
      status = false;
    }
    else if(status)
    {
      axios.post('http://localhost:8000/tweet', {
        data : this.state,
      })
      .then(function (response) {
        location.reload();
         browserHistory.push("/user/" + response.data.userId)
      })
      .catch(function (error) {

      });

    }
  }

  onFieldChange(event){
    this.setState({
      [ event.target.name]: event.target.value
    });
  }

  render() {

    var tweet = [];
     if(this.state.data.tweets) {

      for (var i = 0; i < this.state.data.tweets.length ; i++) {
        if(this.state.data.tweets[i].imagetweet) {
        let image = '', imagetweet='';
          image = `http://localhost:8000/images/${this.state.data.tweets[i].image}`
          imagetweet = `http://localhost:8000/images/${this.state.data.tweets[i].imagetweet}`;
          tweet.push(
            <div key={i} className="media block-update-card center" style={{margin: "10px auto",width: "100%",}}>
              <p href="#" className="pull-left">
                <img src={image}
                alt="sss"
                height="50px"
                width="50px"
                className="img-circle media-object"/>
              </p>
              <div className="pull-right"  style={{margin:" 5px 5px",}}>
                {this.state.data.tweets[i].time}
              </div>
              <div key={i} className="media-body update-card-body" >
                <p href="/profile/" className="media-heading"> {this.state.data.tweets[i].username}</p>
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
        } else {
          let image = '';
          image = `http://localhost:8000/images/${this.state.data.tweets[i].image}`
         tweet.push( <div key={i} className="media block-update-card center" style={{margin: "10px auto",width: "100%",height:"100px"}}>
            <p href="#" className="pull-left">
              <img src={image}
              alt="sss"
              height="50px"
              width="50px"
              className="img-circle media-object"/>
            </p>
            <div className="pull-right"  style={{margin:" 5px 5px",}}>
                {this.state.data.tweets[i].time}
              </div>
            <div key={i} className="media-body update-card-body">
              <a href="/profile/" className="media-heading">{this.state.data.tweets[i].username}</a>
              <div  key={i}> {this.state.data.tweets[i].tweet} </div>
              <p></p>
            </div>
          </div>
          );
        }
      }
    }

    var follower = [];

    if(this.state.data.follow) {

       for ( i = 0; i < this.state.data.follow.length ; i++) {

        if(this.state.data.follow) {
          let image = '';
          image = `http://localhost:8000/images/${this.state.data.follow[i].image}`
          let a = this.state.data.follow[i].user_id;
          follower.push(
             <div key={i} className="media block-update-card right" style={{height:"250px",width: "60%",}}>
                  <img name="profile"
                  src={image}
                  alt="www"
                  height="150px"
                  width="150px"
                  className="img-circle center-block"/>
                  <h5 className="h5">{this.state.data.follow[i].username}</h5>
                  <form>
                    <input
                      value={a}
                      type="hidden"
                      name="followerId"/>
                    <input
                      onClick={this.onfollow.bind(this, a)}
                      id={a}
                      type="submit"
                      value="Follow"
                      className="btn-sm btn-info waves-effect waves-light center-block"/>
                  </form>
                </div>
          );
        }
      }
    }

    let username = '' , profileimage = '';
    if(this.state.data.results){
      profileimage = `http://localhost:8000/images/49aa81c0ce79671b5534261a0b3708c`
      username = this.state.data.results[0].username;
    }

    return(

      <div className="container" >
        <div className="col-sm-3">
          <div className="page-canvas">
            <div className="profile-sidebar">
              <p>
                <i className="glyphicon glyphicon-user">&nbsp;
                </i>
                User Profile
              </p>
               <hr/>
              <div className="profile-userpic center-block ">
                <img name="profile"
                  src={profileimage}
                  alt="www"
                  height="200px"
                  width="200px"
                  className="simg-circle "/>
                <div className="profile-usertitle ">
                  <div className="profile-usertitle-name ">
                  <h1> { username } </h1>
                  </div>
                </div>
              </div>
            </div>
            <div className="profile-usermenu">
              <ul className="nav">
                <li>
                  <a onClick={this.onProfileClick}>
                    <i className="glyphicon glyphicon-user"></i>
                      Profile
                  </a>
                </li>
                <li className="active">
                  <a href="#">
                    <i className="glyphicon glyphicon-home"></i>
                        home
                  </a>
                </li>
                <li>
                  <a onClick={this.onfollowerCLick}>
                    <i className="glyphicon glyphicon-ok"></i>
                      followers &nbsp; &nbsp; &nbsp;
                      <span className="badge">{this.state.data.count}
                      </span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="profile-content">
            <div className="row">
              <p><i className="glyphicon glyphicon-pencil">&nbsp;
                </i>What's in your mind ??
              </p>
            <hr/>
            </div>
            <div className="row">
              <div className="no-padding blank">

                <div className="status-upload">
                  <div className="page-canvas">
                    <form encType="multipart/form-data">
                      <textarea
                        value={this.state.tweet}
                        onChange={this.onFieldChange}
                        name="tweet"
                        placeholder="What are you doing right now?"
                        maxLength="140"
                        />
                        <HelpBlock className="errFontStyle"> {this.state.tweetrequired} </HelpBlock>
                      <div className="form-group">
                        <div className="col-sm-5">
                          <input
                            onClick={this.onsubmittweet}
                            type="submit"
                            value="Tweet"
                            name="Tweet"
                            className="btn-sm btn-info waves-effect waves-light"/>
                        </div>
                        <div className="col-sm-7">
                          <input
                            value={this.state.imagetweet}
                            onChange={this.onFieldChange}
                            type="file"
                            name="imagetweet"
                            className="btn-sm waves-effect waves-light"/>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>

              </div>
            </div>
            <div className="row main">
              <p></p>
              <div className="page-canvas">

                {tweet}

              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-3">
          <div className="profile-content">
            <div className="sidebar-menu">
              <p>
                <i className="glyphicon glyphicon-user">&nbsp;
                </i>
                People you may know
              </p>
              <hr/>
              <div className="row">
              {follower}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default welcome;


