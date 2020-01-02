
import React from 'react';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';
import LastFm from './LastFm';

const DuplicateTrackTable = (props) => {
  return (
    <div style={{width: '60%'}}>
      {Object.keys(props.results).map((artist) => (
        <Paper style={{padding: '10px', marginBottom: '10px'}}>
          <Typography variant="h4">{artist}</Typography>
          <div style={{display: 'flex', flexDirection: 'column'}}>
            {props.results[artist].map(tracks =>
              <div style={{display: 'flex', flexDirection: 'row'}}>
                <div style={{display: 'flex', flexDirection: 'row', margin: '5px', alignItems: 'center', width: '50%'}}>
                  <a href={`https://www.last.fm/user/${props.user}/library/music/${encodeURI(artist)}/_/${encodeURI(tracks.track1)}`} target="_blank" rel="noopener noreferrer"style={{textDecoration: 'none'}}>
                    <Avatar style={{marginLeft: '5px', marginRight: '5px'}}>
                      <LastFm></LastFm>
                    </Avatar>
                  </a>
                  <Typography>{tracks.track1}</Typography>
                </div>
                <div style={{display: 'flex', flexDirection: 'row', margin: '5px', alignItems: 'center', width: '50%'}}>
                  <a href={`https://www.last.fm/user/${props.user}/library/music/${encodeURI(artist)}/_/${encodeURI(tracks.track2)}`} target="_blank" rel="noopener noreferrer"style={{textDecoration: 'none'}}>
                    <Avatar style={{marginLeft: '5px', marginRight: '5px'}}>
                      <LastFm></LastFm>
                    </Avatar>
                  </a>
                  <Typography>{tracks.track2}</Typography>
                </div>
              </div>
            )}
          </div>
        </Paper>
      ))}
    </div>
  );
};

export default DuplicateTrackTable;
