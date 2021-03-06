
import React from 'react';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import { LastFmIcon } from './Icons';

const baseURL = (user, artist) => `https://www.last.fm/user/${user}/library/music/${encodeStr(artist)}`;
const encodeStr = (str) => encodeURI(str).replace(/\+/g, '%252B').replace(/%20/g, '+').replace('/', '%2F'); 
const suffix = (type, result) => (type === 'tracks' ? `/_/` : '/') + encodeStr(result);

const Cell = (props) => {
  return (
    <div className='table-cell' style={{display: 'flex', flexDirection: 'row', alignItems: 'center', width: '50%'}}>
      <a href={props.link} target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none', padding: '5px'}}>
        <Avatar>
          <LastFmIcon></LastFmIcon>
        </Avatar>
      </a>
      <Typography style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}}>{props.result}</Typography>
    </div>
  )
}

const TableEntry = (props) => {
  let result1Link = baseURL(props.user, props.artist ? props.artist : props.results.result1);
  let result2Link = baseURL(props.user, props.artist ? props.artist : props.results.result2);

  if (props.type !== 'artists') {
    result1Link += suffix(props.type, props.results.result1);
    result2Link += suffix(props.type, props.results.result2);
  }

  return (
    <div style={{display: 'flex', flexDirection: 'row'}}>
      <Cell link={result1Link} result={props.results.result1}></Cell>
      <Cell link={result2Link} result={props.results.result2}></Cell>
    </div>
  );
};

export default TableEntry;
