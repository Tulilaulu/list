import React, { Component } from 'react';
import './App.css';
import Notification from './components/Notification'
import List from './components/List'
import Lists from './components/Lists'
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      error: null
    }
  }



  render() {

    return (
      <div>
        <Notification message={this.state.error} />
        <Router>
        <div>
        <Route exact={true} path="/" component={Lists} />
        <Route path="/:name" component={List} /> 
        </div>
        </Router>

      </div>
    )
  }
}

export default App
