import React from 'react';

import DataTable from '../components/DataTable';

import AuthService from '../services/auth.service';
import { get, post, put, del } from '../helpers/requests';

class OperationTypeView extends React.Component {
  state = {
    items: []
  }

  fields = [
            {
              field: 'name',
              name: 'Nome',
              type: 'text'
            },
            {
              field: 'description',
              name: 'Descrizione',
              type: 'textarea'
            }
          ]

  addItem = async (item) => {
    const token = await AuthService.getToken();
    if(token){
      item.id = item.name.toLowerCase().replace(/\s/g, '');

      let newItem = await post("operation_type/", item, token);
      this.setState(prevState => ({
        items: [...prevState.items, newItem]
      }));
    }
  }

  updateItem = async (item) => {
    const token = await AuthService.getToken();
    if(token){
      let updatedItem = await put (`operation_type/${item.id}/`, item, token);
      const itemIndex = this.state.items.findIndex(data => data.id === updatedItem.id);
      const newArray = [
        // destructure all items from beginning to the indexed item
        ...this.state.items.slice(0, itemIndex),
        // add the updated item to the array
        updatedItem,
        // add the rest of the items to the array from the index after the replaced item
        ...this.state.items.slice(itemIndex + 1)
      ]
      this.setState({ items: newArray });
    }
  }

  deleteItem = async (id) => {
    const token = await AuthService.getToken();
    if(token){
      await del (`operation_type/${id}/`, token);
      const updatedItems = this.state.items.filter(item => item.id !== id);
      this.setState({ items: updatedItems });
    }
  }

  async componentDidMount(){
    const token = await AuthService.getToken();
    if(token){
      let items = await get("operation_type/", token);
      items = items.map(item => {
        return item;
      });
      this.setState({items: items});
    }
  }

  render() {
    return (
      <div style={{width: '97%', paddingLeft: '3%'}}>
        <h1 style={{margin: "20px 0"}}>Tipi di operazione</h1>
        <hr />
        <DataTable objectName="Tipo di Operazione"
                    detailed={["/operation", "Vedi tutti"]}
                    fields={this.fields}
                            items={this.state.items}
                            addAction={this.addItem}
                            updateAction={this.updateItem}
                            deleteAction={this.deleteItem}
                            variable/>
      </div>
    )
  }
}

export default OperationTypeView;
