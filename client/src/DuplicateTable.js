
import React from 'react';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';
import LastFm from './LastFm';

const DuplicateTable = (props) => {
  let urlSeparator = props.type === 'tracks' ? '_/' : '';
  return (
    <div style={{width: '60%'}}>
      {Object.keys(props.results).map((artist) => (
        <Paper style={{padding: '10px', marginBottom: '10px'}}>
          <a href={`https://www.last.fm/music/${encodeURI(artist)}`} target="_blank" rel="noopener noreferrer"style={{textDecoration: 'none', color: 'white'}}>
            <Typography variant="h4">{artist}</Typography>
          </a>
          <div style={{display: 'flex', flexDirection: 'column'}}>
            {props.results[artist].map(results =>
              <div style={{display: 'flex', flexDirection: 'row'}}>
                <div style={{display: 'flex', flexDirection: 'row', margin: '5px', alignItems: 'center', width: '50%'}}>
                  <a href={`https://www.last.fm/user/${props.user}/library/music/${encodeURI(artist)}/${urlSeparator}${encodeURI(results.result1)}`} target="_blank" rel="noopener noreferrer"style={{textDecoration: 'none'}}>
                    <Avatar style={{marginLeft: '5px', marginRight: '5px'}}>
                      <LastFm></LastFm>
                    </Avatar>
                  </a>
                  <Typography>{results.result1}</Typography>
                </div>
                <div style={{display: 'flex', flexDirection: 'row', margin: '5px', alignItems: 'center', width: '50%'}}>
                  <a href={`https://www.last.fm/user/${props.user}/library/music/${encodeURI(artist)}/${urlSeparator}${encodeURI(results.result2)}`} target="_blank" rel="noopener noreferrer"style={{textDecoration: 'none'}}>
                    <Avatar style={{marginLeft: '5px', marginRight: '5px'}}>
                      <LastFm></LastFm>
                    </Avatar>
                  </a>
                  <Typography>{results.result2}</Typography>
                </div>
              </div>
            )}
          </div>
        </Paper>
      ))}
    </div>
  );
};

export default DuplicateTable;
