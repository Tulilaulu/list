import React from 'react'
import listService from '../services/lists'

class Item extends React.Component {
  constructor(props) {
      console.log(props)
    super(props)
    this.state = {
      editing: false,
      name: props.item.name,
      notes: props.item.notes,
      quantity: props.item.quantity,
      id: props.item._id,
      listId: props.listId
    }
  }

  editItem = () => {
    this.setState({
        editing: true
    })
  }

  saveEditedItem = (event) =>{
    event.preventDefault()
    const item = {
      _id: this.state.id,
      notes: this.state.notes,
      name: this.state.name,
      quantity: this.state.quantity
    }
    console.log("save edited item", item)    
    listService
      .editItem(this.state.listId, item)
      .then(changedList => {
        this.props.updateList(changedList)
        this.setState({
          editing: false
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

  deleteItem = () => {
    console.log("delete", this.state.id)
    listService
    .deleteItem(this.state.listId, this.state.id)
    .then(changedList => {
      this.props.updateList(changedList)
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

  toggleEditing = () => {
    this.setState({ editing: !this.state.editing })
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value 
    })
  }

  render() {
    return (
        <li key={this.state.id}>
            {this.state.editing ? (
              <form className="add-form" onSubmit={this.saveEditedItem}>
                <label>Nimi:</label><input type="text" name="name" value={this.state.name} onChange={this.handleChange}/>
                <br/>
                <label>Määrä:</label><input type="text" name="quantity" value={this.state.quantity} onChange={this.handleChange}/><br/>
                <label>Muuta:</label><input type="text" name="notes" value={this.state.notes} onChange={this.handleChange}/><br/>
                <input type="submit" value="Tallenna"/>
              </form>
            ) : (                
            <>
              <span className="fa fa-times" onClick={this.deleteItem}></span>
              <span className="fa fa-pencil" onClick={this.editItem}></span>
              <h4 className="name">{this.state.name}</h4>
              <span className="quantity">{this.state.quantity} </span> 
              <span className="notes">({this.state.notes})</span>
            </>
            )}
        </li>
    )
  }
}

export default Item
