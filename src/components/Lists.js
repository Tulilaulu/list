import React, { Component } from 'react';
import '../App.css';
import Notification from './Notification'
import listService from '../services/lists'
import { Redirect } from 'react-router-dom'

class Lists extends React.Component {
  constructor() {
    super()
    this.state = {
      lists: [],
      newList: '',
      error: null,
      toList: false
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

  makeNewList = async (event) => {
    event.preventDefault()
    console.log(this.state.newList);
    var asdf = listService.getByName(this.state.newList)
    
    if (asdf){
      this.setState({
        error: `Nimellä '${this.state.newList}' on jo olemassa lista`,
      })
      setTimeout(() => {
        this.setState({ error: null })
      }, 8000)
    }
    else{
      const listObject = {
        name: this.state.newList,
        date: new Date(),
      }
      
      listService
        .create(listObject)
        .then(newList => {
          this.setState({
            toList: true
          })
        })
    }
  }

  render() {
    if (this.state.toList === true) {
      return <Redirect to={{pathname: '/'+this.state.newList}}></Redirect>
    }
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
