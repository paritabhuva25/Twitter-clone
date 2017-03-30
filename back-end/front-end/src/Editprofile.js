import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import './Login.css';

class Editprofile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: '',
      imagePreviewUrl: '',
    };
    this.handleImageChange = this.handleImageChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onskipClick = this.onskipClick.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const imageFile = this.state.file;

    return new Promise((resolve, reject) => {
      let imageFormData = new FormData();

      imageFormData.append('imageFile', imageFile);
      imageFormData.append('userId', this.props.params.Id);
      var xhr = new XMLHttpRequest();

      xhr.open('post', 'http://localhost:8000/upload/'+this.props.params.Id , true);
      console.log(this.state.file);
      xhr.onload = function () {
        if (this.status == 200) {
          resolve(this.response);
        }
      };
      xhr.send(imageFormData);

    });
  // TODO: do something with -> this.state.file
}

  handleImageChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result
      });
    }

    reader.readAsDataURL(file)
  }
  onskipClick(e){
      browserHistory.push("/login");
  }
  render() {
    let {imagePreviewUrl} = this.state;
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (<img src={imagePreviewUrl} />);
    }

    return (
      <div>
        <div className="container">
          <form className="form-horizontal page-canvas">
            <div className="signin-wrapper form logbox">
              <div className="form-group">
                <div className="col-md-12">
                  <h2>Add Your profile image here!!</h2>
                </div>
              </div>
              <div className="form-group">
                <div className="col-md-12">
                  <input
                   type="file" onChange={this.handleImageChange} />
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-group">

                  {$imagePreview}
                </div>
              </div>
              <div className="form-group">
                <div className="col-md-12">
                  <input
                  className="form-control button btn-info"
                  type="submit" name="Submit"
                  onClick={this.handleSubmit}
                  value="Upload Image"/>
                </div>
              </div>
              <div className="form-group">
                <div className="col-md-12">
                  <lable> If You don't want to add your image than &nbsp;&nbsp;
                  <a className="a" onClick={this.onskipClick}>skip it</a>
                  <br/><br/>
                  It will take a default image</lable>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }

}
export default Editprofile;



