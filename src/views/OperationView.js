import React from 'react';
import DataTable from '../components/DataTable';

class OperationView extends React.Component {
  state = {
    schema: [
              {
                field: 'id',
                name: `Codice Operazione`,
                type: 'number',
                fixed: true,
                modifiable: false
              },
              {
                field: 'date',
                name: 'Data',
                type: 'date',
                fixed: true,
                modifiable: true
              },
              {
                field: 'barrel',
                name: 'Barile',
                type: 'barrel',
                fixed: true,
                modifiable: true
              }
            ],
    items: []
  }

  objectName = "";

  addItem = (item) => {
    let newItem = {}
    let values = {};
    this.state.schema.map(field => {
      if(field.fixed){
        newItem[field.field] = item[field.field];
      }
      else{
        values[field.field] = item[field.field];
      }
      return null;
    });
    newItem.values = JSON.stringify(values);

    newItem.type = this.props.match.params.name;
    console.log(newItem);
    fetch(`http://localhost:8000/api/operation/${this.props.match.params.name}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(newItem)
    })
      .then(response => {
        console.log(response.statusText);
        return response.statusText === 'Created' ? response.json() : null
      })
      .then(item => {
        let newItem  = {...item, ...JSON.parse(item.values)};
        this.setState(prevState => ({
          items: [...prevState.items, newItem]
        }))
      })
      .catch(err => console.log(err));
  }

  updateItem = (updatedItem) => {
    fetch(`http://localhost:8000/api/operation/${this.props.match.params.name}/${updatedItem.id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(updatedItem)
    })
      .then(response => response.json())
      .then(item => {
        const itemIndex = this.state.items.findIndex(data => data.id === item.id);
        const newArray = [
        // destructure all items from beginning to the indexed item
          ...this.state.items.slice(0, itemIndex),
        // add the updated item to the array
          item,
        // add the rest of the items to the array from the index after the replaced item
          ...this.state.items.slice(itemIndex + 1)
        ]
        this.setState({ items: newArray });

      })
      .catch(err => console.log(err));
  }

  deleteItem = (id) => {
    fetch(`http://localhost:8000/api/operation/${this.props.match.params.name}/${id}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
          Accept: 'application/json'
      }
    })
    .then(response => response.statusText === 'No Content' ? null : response.json())
    .then(item => {
      const updatedItems = this.state.items.filter(item => item.id !== id);
      this.setState({ items: updatedItems });
    })
    .catch(err => console.log(err));
  }

  componentDidMount(){
    fetch(`http://localhost:8000/api/operation_type/${this.props.match.params.name}/`)
      .then(response => response.json())
      .then(type => {
        this.objectName = type.name
        this.setState({schema: [...this.state.schema, ...JSON.parse(type.schema)]});
        fetch(`http://localhost:8000/api/operation/${this.props.match.params.name}/`)
          .then(response => response.json())
          .then(items => {
            items = items.map(item => {
              return {...item, ...JSON.parse(item.values)};
            });
            console.log(items);
            this.setState({items})
          })
          .catch(err => console.log(err))
      })
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div>
        <h1 style={{margin: "20px 0"}}>{this.objectName}</h1>
        <DataTable objectName={this.objectName}
                    fields={this.state.schema}
                    items={this.state.items}
                    addAction={this.addItem}
                    updateAction={this.updateItem}
                    deleteAction={this.deleteItem}/>
      </div>
    )
  }
}

export default OperationView;
