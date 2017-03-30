
import React, { Component } from 'react';
import cookie from 'react-cookie';
import {browserHistory} from 'react-router';
import axios from 'axios';
import './followers.css';

class Followers extends Component{

  constructor(props) {
    super(props);

    this.state={
      data:'',
    }

    this.onunfollow = this.onunfollow.bind(this);
    this.onHomeClick = this.onHomeClick.bind(this);
    this.onProfileClick = this.onProfileClick.bind(this);
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
  onProfileClick(e) {
    let userId = this.props.params.Id
      if(userId)
        browserHistory.push("/profile/" +userId)
      else
        browserHistory.push("/login")
    e.preventDefault(e);
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

  }
  onHomeClick(e) {
    let userId = this.props.params.Id
      if(userId)
        browserHistory.push("/user/" +userId)
      else
        browserHistory.push("/login")
    e.preventDefault(e);
  }
  render() {
    var follower = [];
    if(this.state.data.users) {
      let image = ''

       for (var i = 0; i < this.state.data.users.length ; i++) {

        if(this.state.data.users) {
          let a = this.state.data.users[i].id;
          image = `http://localhost:8000/images/${this.state.data.users[i].image}`
          follower.push(
             <div key={i}
                  className="media block-update-card  left  center-block"
                  style={{height:"250px",width: "20%",}}>
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
                  <a onClick={this.onHomeClick}>
                    <i className="glyphicon glyphicon-user"> Profile</i>
                  </a>
                </li>
                <li>
                  <a onClick={this.onProfileClick}>
                    <i className="glyphicon glyphicon-home"> home</i>
                  </a>
                </li>
                <li>
                  <a href="/followers">
                    <i className="glyphicon glyphicon-ok"> folllowers &nbsp;&nbsp;&nbsp;</i>
                      <span className="badge">{this.state.data.count}</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-sm-9">
            <div className="profile-content">
              <div className="row">
                <p className="align"><i className="glyphicon glyphicon-pencil">&nbsp;
                </i>Your followers are  here  !!</p>
                 <hr/>
              </div>
              <div className="row">
              {follower}
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
export default Followers;



