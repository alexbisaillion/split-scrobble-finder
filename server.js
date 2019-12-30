const express = require('express');
const path = require('path');
const request = require('request');
const credentials = require('./credentials');
const isDuplicateTrack = require('./trackRules');

const app = express();
const { PerformanceObserver, performance } = require('perf_hooks');
let start;
let end;

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/tracks', validateReq, getNumTracks, getTracks, partitionTracks, getDuplicates);

function getOptions(params) {
  return {
    url: getURL(params),
    headers: {
      'User-Agent': 'split-scrobbler'
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

function getTrackInUserLibrary(trackURL, user) {
  return trackURL.replace('/music/', `/user/${user}/library/music/`);
}

function validateReq(req, res, next) {
  if (req.query.user) {
    start = performance.now();
    next();
  } else {
    res.status(400).send("Bad request.");
  }
}

function getNumTracks(req, res, next) {
  request(getOptions({method: 'user.getTopTracks', user: req.query.user, limit: 1}), function (error, response, body) {
    if (error) {
      console.log('Error: ' + error);
      res.status(500).send("Internal error.")
    } else {
      res.locals.numTracks = JSON.parse(body)['toptracks']['@attr']['total'];
      res.locals.pageNum  = 1;
      res.locals.tracks = [];
      next();
    }
  });
}

function getTracks(req, res, next) {
  getPage();
  function getPage() {
    request(getOptions({method: 'user.getTopTracks', user: req.query.user, limit: 1000, page: res.locals.pageNum}), function (error, response, body) {
      if (error) {
        console.log('Error: ' + error);
        res.status(500).send("Internal error.");
      } else if (!JSON.parse(body).toptracks) {
        console.log('Last.fm API error');
        res.status(500).send("Internal error.");
      } else {
        res.locals.tracks.push(...JSON.parse(body).toptracks.track);
        if (res.locals.numTracks - 1000 > 0) {
          res.locals.numTracks = res.locals.numTracks - 1000;
          res.locals.pageNum = res.locals.pageNum + 1;
          getPage();
        } else {
          next();
        }
      }
    });
  }
}

function partitionTracks(req, res, next) {
  let partitioned = {};
  let tracks = res.locals.tracks;
  for (let i = 0; i < tracks.length; i++) {
    if (!partitioned[tracks[i].artist.name]) {
      partitioned[tracks[i].artist.name] = [tracks[i].name]
    } else {
      partitioned[tracks[i].artist.name].push(tracks[i].name);
    }
  }
  res.locals.partitioned = partitioned;
  next()
}

function getDuplicates(req, res, next) {
  let matched = [];
  let partitioned = res.locals.partitioned;
  for (let artist of Object.keys(partitioned)) {
    partitioned[artist].sort();
    for (let i = 0; i < partitioned[artist].length - 1; i++) {
      if (isDuplicateTrack(partitioned[artist][i], partitioned[artist][i + 1])) {
        // TODO: If a match is found, compare against the next track to find multiple duplicates
        matched.push({artist: artist, track1: partitioned[artist][i], track2: partitioned[artist][i + 1]});
      }
    }
  }
  end = performance.now();
  console.log(end - start);
  res.json(matched);
}

const port = process.env.PORT || 3001;
app.listen(port);

console.log(`Server listening on ${port}...`);