import React, { Component } from 'react';
import '../App.css';
import Notification from './Notification'
import listService from '../services/lists'
import List from './List'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

class Lists extends React.Component {
  constructor() {
    super()
    this.state = {
      lists: [],
      newList: '',
      error: null,
      username: '',
      password: '',
      user: null
    }
  }

  componentDidMount() {
    listService
      .getAll()
      .then(lists => {
        this.setState({ lists })
        console.log(lists)
      })
  }

  toggleVisible = () => {
    this.setState({ showAll: !this.state.showAll })
  }

  addList = (event) => {
    event.preventDefault()
    const listObject = {
      content: this.state.newList,
      date: new Date(),
    }
    
    listService
      .create(listObject)
      .then(newList => {
        this.setState({
          lists: this.state.lists.concat(newList),
          newList: ''
        })
      })
  }

  handleListChange = (event) => {
    this.setState({ newList: event.target.value })
  }

  handleLoginFieldChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }


  render() {

    return (
      <div>
        <h1>Listat</h1>

        <Notification message={this.state.error} />

        <Router>
         <div>          
          <ul>
            {this.state.lists.map(list => 
              <li key={list.id}><a key={list.name} href={list.name}>{list.name}</a></li>)}          
          </ul>
        </div>
      </Router>

      </div>
    )
  }
}

export default Lists
