const express = require('express');
const path = require('path');
const request = require('request');
const credentials = require('./credentials');
const rules = require('./rules');
const app = express();
const fs = require('fs');

const { performance } = require('perf_hooks');
let start;
let end;

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/tracks', validateReq, getNumTracks, getTracks, partitionResults, getDuplicateTracks);
app.get('/albums', validateReq, getNumAlbums, getAlbums, partitionResults, getDuplicateAlbums);

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

function validateReq(req, res, next) {
  if (req.query.user) {
    start = performance.now();
    next();
  } else {
    res.status(400).json({error: 'Bad request - missing user parameter'});
  }
}

function getNumTracks(req, res, next) {
  request(getOptions({method: 'user.getTopTracks', user: req.query.user, limit: 1}), function (error, response, body) {
    if (error) {
      console.log('Internal server error: ' + error);
      res.status(500).json({error: 'Internal error.'});
    } else if (response.statusCode != 200) {
      console.log('Last.fm API error in getNumTracks');
      let errMessage = 'Last.fm error';
      if (JSON.parse(body).message) {
        errMessage += ': ' + JSON.parse(body).message;
      }
      res.status(400).json({error: errMessage});
    } else {
      res.locals.numTracks = JSON.parse(body)['toptracks']['@attr']['total'];
      res.locals.pageNum  = 1;
      res.locals.results = [];
      next();
    }
  });
}

function getNumAlbums(req, res, next) {
  request(getOptions({method: 'user.getTopAlbums', user: req.query.user, limit: 1}), function (error, response, body) {
    if (error) {
      console.log('Internal server error: ' + error);
      res.status(500).json({error: 'Internal error.'});
    } else if (response.statusCode != 200) {
      console.log('Last.fm API error in getNumAlbums');
      let errMessage = 'Last.fm error';
      if (JSON.parse(body).message) {
        errMessage += ': ' + JSON.parse(body).message;
      }
      res.status(400).json({error: errMessage});
    } else {
      res.locals.numAlbums = JSON.parse(body)['topalbums']['@attr']['total'];
      res.locals.pageNum  = 1;
      res.locals.results = [];
      next();
    }
  });
}

function getTracks(req, res, next) {
  getPage();
  function getPage() {
    request(getOptions({method: 'user.getTopTracks', user: req.query.user, limit: 1000, page: res.locals.pageNum}), function (error, response, body) {
      if (error) {
        console.log('Internal server error: ' + error);
        res.status(500).json({error: 'Internal error.'});
      } else if (response.statusCode != 200) {
        console.log('Last.fm API error in getTracks');
        let errMessage = 'Last.fm error';
        if (JSON.parse(body).message) {
          errMessage += ': ' + JSON.parse(body).message;
        }
        res.status(400).json({error: errMessage});
      } else if (!JSON.parse(body).toptracks) {
        console.log('Last.fm API error - no top tracks');
        res.status(500).json({error: 'Internal error.'});
      } else {
        res.locals.results.push(...JSON.parse(body).toptracks.track);
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

function getAlbums(req, res, next) {
  getPage();
  function getPage() {
    request(getOptions({method: 'user.getTopAlbums', user: req.query.user, limit: 1000, page: res.locals.pageNum}), function (error, response, body) {
      if (error) {
        console.log('Internal server error: ' + error);
        res.status(500).json({error: 'Internal error.'});
      } else if (response.statusCode != 200) {
        console.log('Last.fm API error in getAlbums');
        let errMessage = 'Last.fm error';
        if (JSON.parse(body).message) {
          errMessage += ': ' + JSON.parse(body).message;
        }
        res.status(400).json({error: errMessage});
      } else if (!JSON.parse(body).topalbums) {
        console.log('Last.fm API error - no topalbums');
        res.status(500).json({error: 'Internal error.'});
      } else {
        res.locals.results.push(...JSON.parse(body).topalbums.album);
        if (res.locals.numAlbums - 1000 > 0) {
          res.locals.numAlbums = res.locals.numAlbums - 1000;
          res.locals.pageNum = res.locals.pageNum + 1;
          getPage();
        } else {
          next();
        }
      }
    });
  }
}

function partitionResults(req, res, next) {
  let partitioned = {};
  let results = res.locals.results;
  for (let i = 0; i < results.length; i++) {
    if (!partitioned[results[i].artist.name]) {
      partitioned[results[i].artist.name] = [results[i].name]
    } else {
      partitioned[results[i].artist.name].push(results[i].name);
    }
  }
  res.locals.partitioned = partitioned;
  next();
}

function getDuplicateTracks(req, res, next) {
  let matched = {};
  let partitioned = res.locals.partitioned;
  for (let artist of Object.keys(partitioned)) {
    partitioned[artist].sort((a, b) => sortResults(a, b));
    for (let i = 0; i < partitioned[artist].length - 1; i++) {
      if (rules.isDuplicateTrack(partitioned[artist][i], partitioned[artist][i + 1])) {
        // TODO: If a match is found, compare against the next track to find multiple duplicates
        if (!matched[artist]) {
          matched[artist] = [{track1: partitioned[artist][i], track2: partitioned[artist][i + 1]}];
        } else {
          matched[artist].push({track1: partitioned[artist][i], track2: partitioned[artist][i + 1]});
        }
      }
    }
  }
  end = performance.now();
  console.log(end - start);
  res.status(200).json(matched);
}

function getDuplicateAlbums(req, res, next) {
  let matched = {};
  let partitioned = res.locals.partitioned;
  for (let artist of Object.keys(partitioned)) {
    partitioned[artist].sort((a, b) => sortResults(a, b));
    for (let i = 0; i < partitioned[artist].length - 1; i++) {
      if (rules.isDuplicateAlbum(partitioned[artist][i], partitioned[artist][i + 1])) {
        // TODO: If a match is found, compare against the next track to find multiple duplicates
        if (!matched[artist]) {
          matched[artist] = [{track1: partitioned[artist][i], track2: partitioned[artist][i + 1]}];
        } else {
          matched[artist].push({track1: partitioned[artist][i], track2: partitioned[artist][i + 1]});
        }
      }
    }
  }
  end = performance.now();
  console.log(end - start);
  res.status(200).json(matched);
}

function sortResults(a, b) {
  a = a.replace(/:|\//g,' ').replace(/[^A-Za-z0-9\s]/g, '').toLowerCase();
  b = b.replace(/:|\//g,' ').replace(/[^A-Za-z0-9\s]/g, '').toLowerCase();
  if (a > b) {
    return 1;
  } else if (a < b) {
    return -1;
  }
  return 0;
}

const port = process.env.PORT || 3001;
app.listen(port);

console.log(`Server listening on ${port}...`);