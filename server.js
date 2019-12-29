const express = require('express');
const path = require('path');
const request = require('request');
const credentials = require('./credentials');
const app = express();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/tracks', getNumTracks, getTracks, (req, res, next) => {
  if (req.query.user) {
    next();
  } else {
    res.status(400).send("Bad request.");
  }
});

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
        res.status(500).send("Internal error.")
      } else if (!JSON.parse(body).toptracks) {
        console.log('Last.fm API error');
        res.status(500).send("Internal error.")
      } else {
        res.locals.tracks.push(...JSON.parse(body).toptracks.track);
        if (res.locals.numTracks - 1000 > 0) {
          res.locals.numTracks = res.locals.numTracks - 1000;
          res.locals.pageNum = res.locals.pageNum + 1;
          getPage();
        } else {
          res.json(res.locals.tracks);
        }
      }
    });
  }
}

const port = process.env.PORT || 3001;
app.listen(port);

console.log(`Server listening on ${port}...`);