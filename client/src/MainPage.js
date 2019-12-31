import React, { Component } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {reqType: 'tracks', user: '', isLoading: false, results: []};
    this.handleInputChange = this.handleInputChange.bind(this);
    this.makeRequest = this.makeRequest.bind(this);
  }

  makeRequest(event) {
    if (this.state.reqType && !this.state.isLoading) {
      this.setState({isLoading: true}, () => { 
        fetch(`/${this.state.reqType}?user=${this.state.user}`)
        .then(res => res.json())
        .then(response => this.setState({ results: response, isLoading: false }));
      });    
    }
    event.preventDefault();
  }

  handleInputChange(event) {
    this.setState({ [event.target.name] : event.target.value});
  }

  render() {
    return (
      <form onSubmit={this.makeRequest}>
        <div style={{display: 'flex', flexDirection: 'column', width: '10%'}}>
          <Select name="reqType" value={this.state.reqType} onChange={this.handleInputChange}>
            <MenuItem value={'tracks'}>Tracks</MenuItem>
            <MenuItem value={'albums'}>Albums</MenuItem>
            <MenuItem value={'artists'}>Artists</MenuItem>
          </Select>
          <TextField name="user" label="Username" onChange={this.handleInputChange}/>
          <Button variant="contained" type="submit">Submit</Button>
        </div>
      </form>
    );
  }
}

export default MainPage;