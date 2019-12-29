const request = require("request");
const stringSimilarity = require('string-similarity');
const credentials = require('./credentials');
const isDuplicateTrack = require('./trackRules');
const fs = require('fs');
const user = 'watzpoppiin';

function getOptions(params) {
  return {
    url: getURL(params),
    headers: {
      'User-Agent': 'splitscrobbler'
    }
  }
}

function getURL(params) {
  let url = new URL('http://ws.audioscrobbler.com/2.0/');
  for (const [param, val] of Object.entries(params)) {
    url.searchParams.append(param, val)
  }
  url.searchParams.append('format', 'json');
  url.searchParams.append('api_key', credentials.API_KEY);
  return url;
}

function getNumTracks() {
  request(getOptions({method: 'user.getTopTracks', user: user, limit: 1}), function (error, response, body) {
    if (error) {
      console.log('Error: ' + error);
    } else {
      getTracks(JSON.parse(body)['toptracks']['@attr']['total'], 1, []);
    }
  });
}

function getTracks(numTracks, pageNum, tracks) {
  request(getOptions({method: 'user.getTopTracks', user: user, limit: 1000, page: pageNum}), function (error, response, body) {
    if (error) {
      console.log('Error: ' + error);
    } else if (!JSON.parse(body).toptracks) {
      console.log('Last.fm API error');
    } else {
      tracks.push(...JSON.parse(body).toptracks.track);
      if (numTracks - 1000 > 0) {
        getTracks(numTracks - 1000, pageNum + 1, tracks);
      } else {
        partitionTracks(tracks);
      }
    }
  });
}

function partitionTracks(tracks) {
  let partitioned = {};
  for (let i = 0; i < tracks.length; i++) {
    if (!partitioned[tracks[i].artist.name]) {
      partitioned[tracks[i].artist.name] = [{name: tracks[i].name, url: getTrackInUserLibrary(tracks[i].url, user)}]
    } else {
      partitioned[tracks[i].artist.name].push({name: tracks[i].name, url: getTrackInUserLibrary(tracks[i].url, user)});
    }
  }
  
  let matched = [];
  for (let artist of Object.keys(partitioned)) {
    partitioned[artist].sort((a, b) => (a.name > b.name) ? 1 : -1);
    for (let i = 0; i < partitioned[artist].length - 1; i++) {
      let track1 = partitioned[artist][i].name;
      let track2 = partitioned[artist][i + 1].name;
      if (isDuplicateTrack(track1, track2)) {
        // If not matched, should continue comparing
        matched.push({track1: track1, track2: track2});
      }
    }
  }


  
  fs.writeFile("test8.txt", JSON.stringify(matched), function(err) {
    if (err) {
      console.log(err);
    }
  });
  
}

function getTrackInUserLibrary(trackURL, user) {
  return trackURL.replace('/music/', `/user/${user}/library/music/`);
}

getNumTracks();