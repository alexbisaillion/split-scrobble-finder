
import React from 'react';
import Paper from '@material-ui/core/Paper';
import TableEntry from './TableEntry';

const DuplicateArtistTable = (props) => {
  return (
    <div style={{width: '75%'}}>
      <Paper style={{padding: '10px'}}>
        {props.results.map(result =>
          <TableEntry type={'artists'} results={result} user={props.user} key={result.result1+result.result2}></TableEntry>
        )}
      </Paper>
    </div>
  );
};

export default DuplicateArtistTable;
