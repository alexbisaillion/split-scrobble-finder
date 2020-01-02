import React, { Component } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import './MainPage.css';
import { withStyles } from "@material-ui/core/styles";
import DuplicateTrackTable from './DuplicateTrackTable';
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import green from '@material-ui/core/colors/green';
import blue from '@material-ui/core/colors/blue';

const styles = theme => ({
  root: {
    margin: theme.spacing(4),
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  formElement: {
    margin: '10px',
  }
});

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: green,
    secondary: blue
  }
});

class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {reqType: 'tracks', user: '', isLoading: false, results: {}};
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
    const { classes } = this.props;
    let resultsView;
    if (this.state.isLoading) {
      resultsView = <LinearProgress variant="query" style={{width: '100%'}}/>;
    } else {
      if (this.state.reqType === 'tracks') {
        resultsView = <DuplicateTrackTable user={this.state.user} results={this.state.results}></DuplicateTrackTable>;
      }
    }
    return (
      <MuiThemeProvider theme={theme}>
        <div className={classes.root}>
          <Typography variant="h2" style={{padding: '10px'}}>Split Scrobbler</Typography>
          <form onSubmit={this.makeRequest}>
            <div className='request-form' style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
              <Select className={classes.formElement} name="reqType" value={this.state.reqType} onChange={this.handleInputChange} style={{textAlign: 'left'}}>
                <MenuItem value={'tracks'}>Tracks</MenuItem>
                <MenuItem value={'albums'}>Albums</MenuItem>
                <MenuItem value={'artists'}>Artists</MenuItem>
              </Select>
              <TextField className={classes.formElement} name='user' label='Username' onChange={this.handleInputChange}/>
              <Button className={classes.formElement} variant='contained' type='submit'>Submit</Button>
            </div>
          </form>
          {resultsView}
        </div>
      </MuiThemeProvider>
    );
  }
}

export default withStyles(styles)(MainPage);
