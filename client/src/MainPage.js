import React, { Component } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import './MainPage.css';
import { withStyles } from "@material-ui/core/styles";
import DuplicateTable from './DuplicateTable';
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import green from '@material-ui/core/colors/green';
import blue from '@material-ui/core/colors/blue';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import DuplicateArtistTable from './DuplicateArtistTable';

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
    this.state = {reqType: 'tracks', user: '', useRules: true, isLoading: false, results: {}, error: ''};
    this.handleInputChange = this.handleInputChange.bind(this);
    this.makeRequest = this.makeRequest.bind(this);
  }

  makeRequest(event) {
    if (this.state.reqType && !this.state.isLoading) {
      this.setState({isLoading: true}, () => {
        fetch(`/${this.state.reqType}?user=${this.state.user}&useRules=${this.state.useRules}`).then(response => {
          if (response.status === 200) {
            response.json().then(res => {
              this.setState({ results: this.state.reqType === 'artists' ? {matches: res} : res, isLoading: false, error: '' });
            });
          } else {
            response.json().then(res => {
              this.setState({ results: '', isLoading: false, error: res.error });
            });
          }
        })
      });
    }
    event.preventDefault();
  }

  handleInputChange(event) {
    if (event.target.name === 'reqType') {
      this.setState({ results: {} });
    }
    this.setState({ [event.target.name] : event.target.name === 'useRules' ? event.target.checked : event.target.value});
  }

  render() {
    const { classes } = this.props;
    let resultsView;
    if (this.state.isLoading) {
      resultsView = <LinearProgress variant="query" style={{width: '100%'}}/>;
    } else {
      if (this.state.results) {
        if (this.state.reqType === 'albums' || this.state.reqType === 'tracks') {
          resultsView = <DuplicateTable user={this.state.user} results={this.state.results} type={this.state.reqType}></DuplicateTable>;
        } else if (this.state.results.matches) {
          resultsView = <DuplicateArtistTable user={this.state.user} results={this.state.results.matches}></DuplicateArtistTable>
        }
      } else {
        resultsView = <Typography variant='body1'>{this.state.error}</Typography>
      }
    }
    return (
      <MuiThemeProvider theme={theme}>
        <div className={classes.root}>
          <Typography variant="h2" style={{padding: '10px'}}>Split Scrobbler</Typography>
          <form onSubmit={this.makeRequest}>
            <div className='request-form' style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
              <Select className={classes.formElement} name='reqType' value={this.state.reqType} onChange={this.handleInputChange} style={{textAlign: 'left'}}>
                <MenuItem value={'tracks'}>Tracks</MenuItem>
                <MenuItem value={'albums'}>Albums</MenuItem>
                <MenuItem value={'artists'}>Artists</MenuItem>
              </Select>
              <TextField className={classes.formElement} name='user' label='Username' onChange={this.handleInputChange}/>
              <FormControlLabel
                className={classes.formElement}
                control={<Switch name='useRules' value={this.state.useRules} checked={this.state.useRules} onChange={this.handleInputChange} />}
                label="Use rules"
              />
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
