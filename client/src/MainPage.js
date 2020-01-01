import React, { Component } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import SvgIcon from '@material-ui/core/SvgIcon';
import './MainPage.css';

function LastFm() {
  return (
    <SvgIcon>
      <path d="M10.599 17.211l-.881-2.393s-1.433 1.596-3.579 1.596c-1.9 0-3.249-1.652-3.249-4.296 0-3.385 1.708-4.596 3.388-4.596 2.418 0 3.184 1.568 3.845 3.578l.871 2.751c.871 2.672 2.523 4.818 7.285 4.818 3.41 0 5.722-1.045 5.722-3.801 0-2.227-1.276-3.383-3.635-3.935l-1.757-.384c-1.217-.274-1.577-.771-1.577-1.597 0-.936.736-1.487 1.952-1.487 1.323 0 2.028.495 2.147 1.679l2.749-.33c-.225-2.479-1.937-3.494-4.745-3.494-2.479 0-4.897.936-4.897 3.934 0 1.873.902 3.058 3.185 3.605l1.862.443c1.397.33 1.863.916 1.863 1.713 0 1.021-.992 1.441-2.869 1.441-2.779 0-3.936-1.457-4.597-3.469l-.901-2.75c-1.156-3.574-3.004-4.896-6.669-4.896C2.147 5.327 0 7.879 0 12.235c0 4.179 2.147 6.445 6.003 6.445 3.108 0 4.596-1.457 4.596-1.457v-.012z"/>
    </SvgIcon>
  );
}

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
    console.log(this.state.results);
    return (
      <div>
        <Typography variant="h2">Split Scrobbler</Typography>
        <form onSubmit={this.makeRequest}>
          <div style={{display: 'flex', flexDirection: 'column', width: '10%'}}>
            <Select name="reqType" value={this.state.reqType} onChange={this.handleInputChange}>
              <MenuItem value={'tracks'}>Tracks</MenuItem>
              <MenuItem value={'albums'}>Albums</MenuItem>
              <MenuItem value={'artists'}>Artists</MenuItem>
            </Select>
            <TextField name='user' label='Username' onChange={this.handleInputChange}/>
            <Button variant='contained' type='submit'>Submit</Button>
          </div>
        </form>

        <div>
          {Object.keys(this.state.results).map((artist) => (
            <div>
              <Typography variant="h4">{artist}</Typography>
              <List>
                {this.state.results[artist].map(tracks =>
                  <ListItem>
                    <ListItemAvatar>
                      <a href={`https://www.last.fm/user/${this.state.user}/library/music/${encodeURI(artist)}/_/${encodeURI(tracks.track1)}`} target="_blank" rel="noopener noreferrer"style={{textDecoration: 'none'}}>
                        <Avatar>
                            <LastFm></LastFm>
                        </Avatar>
                      </a>
                    </ListItemAvatar>
                    <ListItemText
                      primary={tracks.track1}
                    />
                    <ListItemAvatar>
                      <a href={`https://www.last.fm/user/${this.state.user}/library/music/${encodeURI(artist)}/_/${encodeURI(tracks.track2)}`} target="_blank" rel="noopener noreferrer"style={{textDecoration: 'none'}}>
                        <Avatar>
                            <LastFm></LastFm>
                        </Avatar>
                      </a>
                    </ListItemAvatar>
                    <ListItemText
                      primary={tracks.track2}
                    />
                  </ListItem>
                )}
              </List>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default MainPage;