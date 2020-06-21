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
import { green, blue } from '@material-ui/core/colors';
import Switch from '@material-ui/core/Switch';
import DuplicateArtistTable from './DuplicateArtistTable';
import { isDuplicateTrack, isDuplicateAlbum, isDuplicateArtist } from './rules';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { Paper, ButtonGroup, List, ListItem, Avatar, ListItemAvatar, ListItemText } from '@material-ui/core';
import { LinkIcon, GitHubIcon, LastFmIcon, HelpIcon } from './Icons';
import { registerPageView, registerDownload, registerRequest, registerLastfmError, registerCount } from './analytics';

const styles = theme => ({
  root: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  mainPageElem: {
    margin: '10px',
  }
});

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: green,
    secondary: blue
  },
  props: {
    MuiInput: { inputProps: { spellCheck: 'false' } }
  }
});

const sortResults = (a, b) => {
  a = a.replace(/:|\//g,' ').replace(/[^A-Za-z0-9\s]/g, '').toLowerCase();
  b = b.replace(/:|\//g,' ').replace(/[^A-Za-z0-9\s]/g, '').toLowerCase();
  if (a > b) {
    return 1;
  } else if (a < b) {
    return -1;
  }
  return 0;
}

const getNumResults = (matched) => Object.keys(matched).reduce((acc, val) => acc + matched[val].length, 0);

class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {reqType: 'tracks', user: '', useRules: true, isLoading: false, loadPercent: 0, results: {}, error: '', isHelpOpen: false, isAboutOpen: false};
    this.handleInputChange = this.handleInputChange.bind(this);
    this.makeRequest = this.makeRequest.bind(this);
    this.getPage = this.getPage.bind(this);
    this.partitionResults = this.partitionResults.bind(this);
    this.HelpDialog = this.HelpDialog.bind(this);
    this.AboutDialog = this.AboutDialog.bind(this);
    this.downloadResults = this.downloadResults.bind(this);
  }

  componentDidMount() {
    registerPageView();
  }

  makeRequest(event) {
    registerRequest(this.state.reqType, this.state.useRules);
    if (this.state.reqType && !this.state.isLoading) {
      this.setState({isLoading: true, loadPercent: 0}, () => {
        fetch(`/num${this.state.reqType}?user=${this.state.user}`).then(response => {
          if (response.status === 200) {
            response.text().then(t => {
              let percentStep = Math.floor(100 / (Math.ceil(parseInt(t) / 1000)));
              this.getPage(parseInt(t), 1, [], percentStep, 0);
            })
          } else {
            response.json().then(res => {
              this.setState({ results: '', isLoading: false, error: res.error });
            });
          }
        });
      });
    }
    event.preventDefault();
  }

  getPage(total, pageNum, results, percentStep, numTries) {
    fetch(`/${this.state.reqType}?user=${this.state.user}&pageNum=${pageNum}`).then(response => {
      if (response.status === 200) {
        response.json().then(res => {
          results.push(...res);
          if (total - 1000 > 0) {
            this.setState({ loadPercent: this.state.loadPercent + percentStep });
            this.getPage(total - 1000, pageNum + 1, results, percentStep);
          } else {
            if (this.state.reqType === 'artists') {
              this.setState({ loadPercent: this.state.loadPercent + percentStep });
              this.getDuplicateArtists(results, percentStep);
            } else {
              this.setState({ loadPercent: this.state.loadPercent + percentStep });
              this.partitionResults(results, percentStep);
            }
          }
        });
      } else {
        response.json().then(res => {
          if (numTries >= 5) {
            registerLastfmError(res.error, this.state.reqType);
            this.setState({ results: '', isLoading: false, error: res.error });
          } else {
            this.getPage(total, pageNum, results, percentStep, numTries + 1);
          }
        });
      }
    });
  }

  partitionResults(results, percentStep) {
    let partitioned = {};
    for (let i = 0; i < results.length; i++) {
      if (!partitioned[results[i].artist]) {
        partitioned[results[i].artist] = [results[i].name]
      } else {
        partitioned[results[i].artist].push(results[i].name);
      }
    }
    if (this.state.reqType === 'tracks') {
      this.setState({ loadPercent: this.state.loadPercent + percentStep });
      this.getDuplicateTracks(partitioned);
    } else {
      this.setState({ loadPercent: this.state.loadPercent + percentStep });
      this.getDuplicateAlbums(partitioned);
    }
  }
  
  getDuplicateTracks(partitioned) {
    let matched = {};
    for (let artist of Object.keys(partitioned)) {
      partitioned[artist].sort((a, b) => sortResults(a, b));
      for (let i = 0; i < partitioned[artist].length - 1; i++) {
        if (isDuplicateTrack(partitioned[artist][i], partitioned[artist][i + 1], this.state.useRules)) {
          // TODO: If a match is found, compare against the next track to find multiple duplicates
          if (!matched[artist]) {
            matched[artist] = [{result1: partitioned[artist][i], result2: partitioned[artist][i + 1]}];
          } else {
            matched[artist].push({result1: partitioned[artist][i], result2: partitioned[artist][i + 1]});
          }
        }
      }
    }
    registerCount(getNumResults(matched), this.state.reqType);
    this.setState({ results: this.state.reqType === 'artists' ? {matches: matched} : matched, isLoading: false, error: '', loadPercent: 100 });
  }

  getDuplicateAlbums(partitioned) {
    let matched = {};
    for (let artist of Object.keys(partitioned)) {
      partitioned[artist].sort((a, b) => sortResults(a, b));
      for (let i = 0; i < partitioned[artist].length - 1; i++) {
        if (isDuplicateAlbum(partitioned[artist][i], partitioned[artist][i + 1], this.state.useRules)) {
          // TODO: If a match is found, compare against the next track to find multiple duplicates
          if (!matched[artist]) {
            matched[artist] = [{result1: partitioned[artist][i], result2: partitioned[artist][i + 1]}];
          } else {
            matched[artist].push({result1: partitioned[artist][i], result2: partitioned[artist][i + 1]});
          }
        }
      }
    }
    registerCount(getNumResults(matched), this.state.reqType);
    this.setState({ results: this.state.reqType === 'artists' ? {matches: matched} : matched, isLoading: false, error: '', loadPercent: 100 });
  }
  
  getDuplicateArtists(results) {
    let matched = [];
    results.sort((a, b) => sortResults(a, b));
    for (let i = 0; i < results.length - 1; i++) {
      if (isDuplicateArtist(results[i], results[i + 1], this.state.useRules)) {
        matched.push({result1: results[i], result2: results[i + 1]});
      }
    }
    registerCount(matched.length, this.state.reqType);
    this.setState({ results: this.state.reqType === 'artists' ? {matches: matched} : matched, isLoading: false, error: '', loadPercent: 100 });
  }

  handleInputChange(event) {
    if (event.target.name === 'reqType') {
      this.setState({ results: {}, loadPercent: 0 });
    }
    this.setState({ [event.target.name] : event.target.name === 'useRules' ? event.target.checked : event.target.value});
  }

  HelpDialog() {
    return (
      <Dialog onClose={() => this.setState({isHelpOpen: false})} open={this.state.isHelpOpen}>
        <DialogTitle>Using rules</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Selecting this option will use a custom rule set I developed to help eliminate false duplicates. For example, "Human After All" and "Human After All - SebastiAn Remix" would be detected as a duplicate without using the rule set.
          </DialogContentText>
        </DialogContent>
      </Dialog>
    );
  }

  AboutDialog() {
    return (
      <Dialog onClose={() => this.setState({isAboutOpen: false})} aria-labelledby="simple-dialog-title" open={this.state.isAboutOpen}>
        <DialogTitle>About</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This web app can help you find duplicate records in your Last.fm library.
          </DialogContentText>
          <DialogContentText>
            Duplicate records often arise from variations in metadata between different streaming services, or updates to the tags of already existing songs, such as adding a feature tag.
          </DialogContentText>
          <DialogContentText>
            This tool will go through your Last.fm library, searching for duplicate tracks, albums, or artists. Direct links are provided to each duplicate that the algorithm finds, so you can edit the scrobbles accordingly on the Last.fm website (of course, you need to have Last.fm Pro to do so).
          </DialogContentText>
          <DialogContentText>
            You can also save the results of your search in either CSV or JSON format.
          </DialogContentText>
          <List>
            <a href='https://github.com/alexbisaillion/split-scrobbler' target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none', color: 'inherit'}}>
              <ListItem button>
                <ListItemAvatar>
                  <Avatar>
                    <GitHubIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText>Source code</ListItemText>
              </ListItem>
            </a>
            <a href='https://alexbisaillion.me/' target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none', color: 'inherit'}}>
              <ListItem button>
                <ListItemAvatar>
                  <Avatar>
                    <LinkIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText>My website</ListItemText>
              </ListItem>
            </a>
            <a href='https://www.last.fm/user/watzpoppiin' target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none', color: 'inherit'}}>
              <ListItem button>
                <ListItemAvatar>
                  <Avatar>
                    <LastFmIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText>My Last.fm</ListItemText>
              </ListItem>
            </a>
          </List>
        </DialogContent>
      </Dialog>
    );
  }

  downloadResults(format) {
    registerDownload(format);
    const element = document.createElement("a");
    let file;
    if (format === 'json') {
      file = new Blob([JSON.stringify(this.state.results)], {type: 'application/json'});
    } else {
      let csvContent;
      if (this.state.reqType === 'tracks' || this.state.reqType === 'albums') {
        let header = this.state.reqType === 'tracks' ? 'track' : 'album'
        csvContent = Object.keys(this.state.results).reduce((acc1, artist) => (
          acc1 + this.state.results[artist].reduce((acc2, result) => acc2 + `"${artist}","${result.result1}","${result.result2}"\n`, '')
        ), `artist,${header}1,${header}2\n`);
      } else {
        csvContent = this.state.results.matches.reduce((acc, result) => acc + `"${result.result1}","${result.result2}"\n`, 'artist1,artist2\n');
      }
      file = new Blob([csvContent], {type: 'text/csv;charset=utf-8;'});
    }
    element.href = URL.createObjectURL(file);
    element.download = `${this.state.user}-${this.state.reqType}.${format}`;
    document.body.appendChild(element);
    element.click();
  }

  render() {
    const { classes } = this.props;
    let resultsView;
    if (this.state.isLoading) {
      resultsView = <LinearProgress variant="determinate" value={this.state.loadPercent} style={{width: '75%', marginTop: '10px'}}/>
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
          <Typography style={{marginTop: '10px'}} variant="h2">Split Scrobbler</Typography>
          <ButtonGroup variant="text" aria-label="text primary button group">
            <Button><a href='https://www.last.fm/' target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none', color: 'white'}}>Powered by Last.fm</a></Button>
            <Button onClick={() => this.setState({isAboutOpen: true})}>About</Button>
          </ButtonGroup>

          <form onSubmit={this.makeRequest} style={{width: '250px'}}>
            <div className='request-form' style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
              <Select className={classes.mainPageElem} name='reqType' value={this.state.reqType} onChange={this.handleInputChange} style={{textAlign: 'left'}}>
                <MenuItem value={'tracks'}>Tracks</MenuItem>
                <MenuItem value={'albums'}>Albums</MenuItem>
                <MenuItem value={'artists'}>Artists</MenuItem>
              </Select>
              <TextField className={classes.mainPageElem} name='user' label='Username' onChange={this.handleInputChange}/>
              <div className={classes.mainPageElem} style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                <Switch name='useRules' value={this.state.useRules} checked={this.state.useRules} onChange={this.handleInputChange} color='primary'/>
                <Typography variant='body1' style={{marginRight: '30px'}}>Use rules</Typography>
                <div onClick={() => this.setState({isHelpOpen: true})}>
                  <HelpIcon></HelpIcon>
                </div>
              </div>
              <Button className={classes.mainPageElem} variant='contained' type='submit'>Submit</Button>
            </div>
          </form>
          {this.state.loadPercent === 100 &&
            <Paper elevation={3} style={{padding: '10px', marginBottom: '10px'}}>
              <Typography className={classes.mainPageElem} variant="h4">Summary</Typography>
              <Typography className={classes.mainPageElem} variant="body1">Number of duplicates: {getNumResults(this.state.results)}</Typography>
              {Object.keys(this.state.results).length > 0 &&
                <ButtonGroup className={classes.mainPageElem} variant="contained" aria-label="contained primary button group">
                  <Button onClick={() => this.downloadResults('csv')}>Download CSV</Button>
                  <Button onClick={() => this.downloadResults('json')}>Download JSON</Button>
                </ButtonGroup>
              }
            </Paper>
          }
          {resultsView}
          <this.HelpDialog></this.HelpDialog>
          <this.AboutDialog></this.AboutDialog>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default withStyles(styles)(MainPage);
