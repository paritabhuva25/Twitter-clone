import React, { Component } from 'react';
import './App.css';
import NevigationBar from './NevigationBar';

class App extends Component {
  render() {
    return (
        <div className="App">
          <NevigationBar {...this.props}/>
          {this.props.children}
        </div>
    );
  }
}
export default App;
