
import React from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import TableEntry from './TableEntry';

const DuplicateTable = (props) => {
  return (
    <div style={{width: '60%'}}>
      {Object.keys(props.results).map((artist) => (
        <Paper style={{padding: '10px', marginBottom: '10px'}} key={artist}>
          <a href={`https://www.last.fm/music/${encodeURI(artist)}`} target="_blank" rel="noopener noreferrer"style={{textDecoration: 'none', color: 'white'}}>
            <Typography variant="h4">{artist}</Typography>
          </a>
          <div style={{display: 'flex', flexDirection: 'column'}}>
            {props.results[artist].map(results =>
              <TableEntry type={props.type} results={results} user={props.user} artist={artist} key={results.result1+results.result2}></TableEntry>
            )}
          </div>
        </Paper>
      ))}
    </div>
  );
};

export default DuplicateTable;
