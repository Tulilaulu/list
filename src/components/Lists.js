import React, { Component } from 'react';
import '../App.css';
import Notification from './Notification'
import listService from '../services/lists'

class Lists extends React.Component {
  constructor() {
    super()
    this.state = {
      lists: [],
      newList: '',
      error: null
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

  handleListNameChange = (event) => {
    this.setState({ newList: event.target.value })
  }

  makeNewList = (event) => {
    event.preventDefault()
    console.log(this.state.newList)
    const listObject = {
      name: this.state.newList,
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


  
  render() {

    return (
      <div>
        <h1>Listat</h1>

        <Notification message={this.state.error} />

        <form onSubmit={this.makeNewList}>
          <label>Tee uusi lista:</label>
          <input type="text" name="newList" onChange={this.handleListNameChange}/>
          <input type="submit" value="Lähetä"/>
        </form>

         <div>          
          <ul>
            {this.state.lists.map(list => 
              <li key={list.id}><a key={list.name} href={list.name}>{list.name}</a></li>)}  
          </ul>
        </div>

      </div>
    )
  }
}

export default Lists
