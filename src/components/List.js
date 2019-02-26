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
      loading: true,
      newName: '',
      newNotes: '',
      newQuantity: 0
    }
  }

  componentDidMount() {
    const { name } = this.props.match.params
    listService
      .getByName(name)
      .then(list => {
        this.setState({ list: list, loading: false })
        console.log(list)
      })
      .catch(error => {
        console.log(error)
        this.setState({
          list: null,
          loading: false
        })
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

  toggleVisibility = () => {
    console.log("toggle")
    const list = this.state.list
    const listObject = { ...list, listed: !list.listed }

    listService
      .update(listObject.id, listObject)
      .then(changedList => {
        this.setState({
          list: changedList
        })
      })
      .catch(error => {
        console.log(error)
        this.setState({
          error: `${list.name}' on jo valitettavasti poistettu palvelimelta TODO virheenkäsittely`
        })
        setTimeout(() => {
          this.setState({ error: null })
        }, 8000)
      })
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  deleteItem = (item) => {
    console.log(item)
    const newItems = this.state.list.items.filter(i => i._id != item._id)
    const newList = {...this.state.list, items: newItems}
    listService
      .update(newList.id, newList)
      .then(changedList => {
        this.setState({
          list: changedList
        })
      })
      .catch(error => {
        console.log(error)
        this.setState({
          error: `virhe`
        })
        setTimeout(() => {
          this.setState({ error: null })
        }, 8000)
      })  
  }

  addItem = (event) => {
    event.preventDefault()
    const newItems = this.state.list.items.concat({
      name: this.state.newName,
      notes: this.state.newNotes,
      quantity: this.state.newQuantity});
    const newList = {...this.state.list, items: newItems}
    listService
      .update(newList.id, newList)
      .then(changedList => {
        this.setState({
          list: changedList,
          newName: '',
          newNotes: '',
          newQuantity: 0
        })
      })
      .catch(error => {
        console.log(error)
        this.setState({
          error: `virhe`
        })
        setTimeout(() => {
          this.setState({ error: null })
        }, 8000)
      })  
  }

  render() {
    const list = this.state.list;
    if (this.state.loading){
      return (                                                          
        <div>Lataa.....</div>
      )
    }
    else if (list == null){
      return ( 
        <div>
          Haettua listaa ei löytynyt<br/>
          <a href="/">Takaisin etusivulle</a>
        </div>
      )
    } else {
      return (
        <div>
          <Notification message={this.state.error} />
          <h1>{list.name}</h1>
          <button onClick={this.toggleVisibility}>{list.listed ? "Piilota etusivun listasta" : "Lisää etusivun listaan"}</button>
          <ul>
              {list.items.map(item => 
                <li key={item._id}>
                {item.name} 
                 {(item.quantity > 0) ? (
                  <span className="quantity">{item.quantity} </span>
                ) : ( '' )}
                <span className="notes">{item.notes}</span>
                <span className="delete" onClick={this.deleteItem.bind(this, item)}>X</span>
                </li>)}  
          </ul>   

          <p>Lisää:</p>
          <form onSubmit={this.addItem}>
            <label>Nimi:</label><input type="text" name="newName" onChange={this.handleChange}/>
            <br/>
            <label>Muuta:</label><input type="text" name="newNotes" onChange={this.handleChange}/><br/>
            <label>Määrä:</label><input type="text" name="newQuantity" onChange={this.handleChange}/><br/>
            <input type="submit" value="Lähetä"/>
          </form>
          <br/>
          <a href="/">Takaisin etusivulle</a>          
        </div>
      )
    }
  }
}

export default List
