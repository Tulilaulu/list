import React, { Component } from 'react';
import '../App.css';
import Notification from './Notification'
import Item from './Item'
import listService from '../services/lists'
import { Redirect } from 'react-router-dom'

class List extends React.Component {
  constructor() {
    super()
    this.state = {
      list: null,
      error: null,
      loading: true,
      newName: '',
      newNotes: '',
      newQuantity: '',
      toFrontpage: false
    }
  }

  componentDidMount() {
    const { name } = this.props.match.params
    listService
      .getByName(name)
      .then(list => {
        this.setState({ list: list, loading: false })
      })
      .catch(error => {
        console.log(error)
        this.setState({
          list: null,
          loading: false
        })
      })
  }

  toggleVisibility = () => {
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

  addItem = (event) => {
    event.preventDefault()
    const newItem = {
      name: this.state.newName,
      notes: this.state.newNotes,
      quantity: this.state.newQuantity};
    listService
      .addItem(this.state.list.id, newItem)
      .then(changedList => {
        console.log(changedList)
        this.setState({
          list: changedList,
          newName: '',
          newNotes: '',
          newQuantity: ''
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

  deleteList = (event) => {
    event.preventDefault()
    if (window.confirm('Haluatko varmasti poistaa koko listan?')){
      listService
        .deleteList(this.state.list.id)
        .then(changedList => {
          this.setState({
            list: null,
            toFrontpage: true
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
  }

  updateList = (list) => {
    this.setState({
      list: list
    })
  }

  render() {
    const list = this.state.list;
    if (this.state.loading){
      return (                                                          
        <div>Lataa.....</div>
      )
    }
    else if (this.state.toFrontpage === true) {
      return <Redirect to={{pathname: '/'}}></Redirect>
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
	  <div className="list-commands">
  	    <a href="/" className="fa fa-arrow-left" title="Takaisin etusivulle" alt="Takaisin etusivulle"></a>
            <a 
	      onClick={this.toggleVisibility} 
	      className={list.listed ? "fa fa-eye-slash" : "fa fa-eye"} 
	      title={list.listed ? "Piilota etusivun listasta" : "Lisää etusivun listaan"}
	      alt={list.listed ? "Piilota etusivun listasta" : "Lisää etusivun listaan"}>
	    </a>
            <a onClick={this.deleteList} className="fa fa-trash" title="Poista koko lista" alt="Poista koko lista"></a>
	  </div>
          <p className="add">Lisää:</p>
          <form onSubmit={this.addItem} className="add-form">
            <label>Nimi:</label><input type="text" name="newName" value={this.state.newName} onChange={this.handleChange}/>
            <br/>
            <label>Määrä:</label><input type="text" name="newQuantity" value={this.state.newQuantity} onChange={this.handleChange}/><br/>
            <label>Muuta:</label><input type="text" name="newNotes" value={this.state.newNotes} onChange={this.handleChange}/><br/>
            <input type="submit" value="Lähetä"/>
          </form>
 
          <ul className="items">
              {list.items.map(item => 
                <Item item={item} key={item._id} listId={this.state.list.id} updateList={this.updateList}/>
              )}  
          </ul>   
        </div>
      )
    }
  }
}

export default List
