import React, { Component } from 'react';
import '../App.css';
import Notification from './Notification'
import listService from '../services/lists'

class List extends React.Component {
  constructor() {
    super()
    this.state = {
      list: null,
      error: null,
    }
  }

  componentDidMount() {
    listService
      .getByName('Lista')
      .then(list => {
        this.setState({ list })
        console.log(list)
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

  toggleImportanceOf = (id) => {
    return () => {
      const list = this.state.lists.find(n => n.id === id)
      const changedList = { ...list, important: !list.important }

      listService
        .update(id, changedList)
        .then(changedList => {
          this.setState({
            lists: this.state.lists.map(list => list.id !== id ? list : changedList)
          })
        })
        .catch(error => {
          this.setState({
            error: `${list.name}' on jo valitettavasti poistettu palvelimelta`,
            lists: this.state.lists.filter(n => n.id !== id)
          })
          setTimeout(() => {
            this.setState({ error: null })
          }, 50000)
        })
    }
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
        <h1>asdf</h1>
      </div>
    )
  }
}

export default List
