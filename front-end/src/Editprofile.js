import React, { Component } from 'react';
import cookie from 'react-cookie';
import {browserHistory} from 'react-router';
import axios from 'axios';
import './followers.css';

class Editprofile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: '',
      imagePreviewUrl: ''
    };
    this._handleImageChange = this._handleImageChange.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
  }

  _handleSubmit(e) {
    e.preventDefault();
    console.log(this.state.file);
    let imageFile = this.state.file;

    return new Promise((resolve, reject) => {
    let imageFormData = new FormData();

    imageFormData.append('imageFile', imageFile);

    var xhr = new XMLHttpRequest();

    xhr.open('post', 'http://localhost:8000/upload', true);

    xhr.onload = function () {
      if (this.status == 200) {
        resolve(this.response);
      } else {
        reject(this.statusText);
      }
    };

    xhr.send(imageFormData);

  });


    // TODO: do something with -> this.state.file
  }

  _handleImageChange(e) {
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

  render() {
    let {imagePreviewUrl} = this.state;
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (<img src={imagePreviewUrl} />);
    }

    return (
      <div>
        <form onSubmit={this._handleSubmit}>
          <input type="file" onChange={this._handleImageChange} />
          <button type="submit" onClick={this._handleSubmit}>Upload Image</button>
        </form>
        {$imagePreview}
      </div>
    )
  }

}
export default Editprofile;



