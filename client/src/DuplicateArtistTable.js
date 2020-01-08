
import React from 'react';
import Paper from '@material-ui/core/Paper';
import TableEntry from './TableEntry';

const DuplicateArtistTable = (props) => {
  return (
    <div style={{width: '60%'}}>
      <Paper style={{padding: '10px', marginBottom: '10px'}}>
        {props.results.map(result =>
          <TableEntry type={'artists'} results={result} user={props.user}></TableEntry>
        )}
      </Paper>
    </div>
  );
};

export default DuplicateArtistTable;
