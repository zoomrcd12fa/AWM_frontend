import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

class EditForm extends React.Component {
  state = {}

  onChange = e => {
    this.setState({[e.target.name]: e.target.value});
  }

  submitForm = e => {
    e.preventDefault();
    this.props.action(this.state);
    this.props.toggle();
  }

  componentDidMount(){
    if(this.props.item){
      this.props.fields.map(field => {
        return this.setState({[field.field]: this.props.item[field.field]});
      });
    }
  }

  render() {
    return (
      <Form onSubmit={this.submitForm}>
          {this.props.fields.map(field => {
            if (this.props.item !== undefined & !field.modifiable){
              return(
                <Form.Group key={field.field}>
                  <Form.Label><h5>{field.name}</h5></Form.Label>
                  <br />
                  {this.state[field.field]}
                </Form.Group>
              )
            }
            else{
              return(
                <Form.Group key={field.field}>
                  <Form.Label><h5>{field.name}</h5></Form.Label>
                  <Form.Control name={field.field}
                                min={field.min}
                                max={field.max}
                                value={this.state[field.field]}
                                type={field.type}
                                onChange={this.onChange}
                                placeholder={field.name}
                                required/>
                </Form.Group>
              )
            }
          })}
        <hr />
        <div class="float-xl-right">
          <Button variant="secondary" onClick={this.props.toggle}>Annulla</Button>
          {' '}
          <Button type="submit">Ok</Button>
        </div>
      </Form>
    );
  }
}

export default EditForm;
