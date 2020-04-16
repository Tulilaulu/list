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
    try {
      await asdf;
      this.setState({
        error: `Nimellä '${this.state.newList}' on jo olemassa lista`,
      })
      setTimeout(() => {
        this.setState({ error: null })
      }, 8000);
    } catch (e) {
      console.log(e);
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
      <div className="lists-page">
        <h1>Listat</h1>

        <Notification message={this.state.error} />
         <div>          
          <ul className="list-list">
            {this.state.lists.map(list => 
              <li key={list.id}><a key={list.name} href={list.name}>{list.name}</a></li>)}  
          </ul>
        </div>

        <form onSubmit={this.makeNewList}>
          <label>Tee uusi lista:</label><br/>	   
          <input type="text" className="new-list-name" name="newList" onChange={this.handleListNameChange}/><br/>	  
          <input type="submit" value="Lähetä"/>
        </form>

      </div>
    )
  }
}

export default Lists
