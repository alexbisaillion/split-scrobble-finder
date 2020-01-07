
import React from 'react';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import LastFm from './LastFm';

const TableEntry = (props) => {
  let urlSeparator = props.type === 'tracks' ? '_/' : '';
  return (
    <div style={{display: 'flex', flexDirection: 'row'}}>
      <div style={{display: 'flex', flexDirection: 'row', margin: '5px', alignItems: 'center', width: '50%'}}>
        <a href={`https://www.last.fm/user/${props.user}/library/music/${encodeURI(props.artist)}/${urlSeparator}${encodeURI(props.results.result1)}`} target="_blank" rel="noopener noreferrer"style={{textDecoration: 'none'}}>
          <Avatar style={{marginLeft: '5px', marginRight: '5px'}}>
            <LastFm></LastFm>
          </Avatar>
        </a>
        <Typography>{props.results.result1}</Typography>
      </div>
      <div style={{display: 'flex', flexDirection: 'row', margin: '5px', alignItems: 'center', width: '50%'}}>
        <a href={`https://www.last.fm/user/${props.user}/library/music/${encodeURI(props.artist)}/${urlSeparator}${encodeURI(props.results.result2)}`} target="_blank" rel="noopener noreferrer"style={{textDecoration: 'none'}}>
          <Avatar style={{marginLeft: '5px', marginRight: '5px'}}>
            <LastFm></LastFm>
          </Avatar>
        </a>
        <Typography>{props.results.result2}</Typography>
      </div>
    </div>
  );
};

export default TableEntry;
