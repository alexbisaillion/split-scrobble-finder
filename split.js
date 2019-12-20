const request = require("request");
const credentials = require('./credentials');

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
  request(getOptions({method: 'user.getTopTracks', user: 'watzpoppiin', limit: 1}), function (error, response, body) {
    if (error) {
      console.log('Error: ' + error);
    } else {
      getTracks(JSON.parse(body)['toptracks']['@attr']['total'], 1, []);
    }
  });
}

function getTracks(numTracks, pageNum, tracks) {
  request(getOptions({method: 'user.getTopTracks', user: 'watzpoppiin', limit: 1000, page: pageNum}), function (error, response, body) {
    if (error) {
      console.log('Error: ' + error);
    } else {
      tracks.push(...JSON.parse(body).toptracks.track);
      if (numTracks - 1000 > 0) { // numTracks - 1000 > 0
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
      partitioned[tracks[i].artist.name] = [tracks[i].name]
    } else {
      partitioned[tracks[i].artist.name].push(tracks[i].name);
    }
  }
  console.log(partitioned);
}

getNumTracks();
