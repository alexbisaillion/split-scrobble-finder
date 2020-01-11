const express = require('express');
const path = require('path');
const request = require('request');
const credentials = require('./credentials');
const app = express();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/numtracks', validateNumReq, getNumTracks);
app.get('/tracks', validateGetReq, getTracks);

app.get('/numalbums', validateNumReq, getNumAlbums);
app.get('/albums', validateGetReq, getAlbums);

app.get('/numartists', validateNumReq, getNumArtists);
app.get('/artists', validateGetReq, getArtists);

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

function validateNumReq(req, res, next) {
  if (req.query.user) {
    next();
  } else {
    res.status(400).json({error: 'Bad request - missing user parameter'});
  }
}

function validateGetReq(req, res, next) {
  if (req.query.user && req.query.pageNum) {
    next();
  } else {
    res.status(400).json({error: 'Bad request - missing parameter'});
  }
}

function getNumTracks(req, res) {
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
      res.status(200).send(JSON.parse(body)['toptracks']['@attr']['total']);
    }
  });
}

function getTracks(req, res) {
  request(getOptions({method: 'user.getTopTracks', user: req.query.user, limit: 1000, page: req.query.pageNum}), function (error, response, body) {
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
      res.status(200).json(JSON.parse(body).toptracks.track.map(track => ({artist: track.artist.name, name: track.name})));
    }
  });
}

function getNumAlbums(req, res) {
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
      res.status(200).send(JSON.parse(body)['topalbums']['@attr']['total']);
    }
  });
}

function getAlbums(req, res) {
  request(getOptions({method: 'user.getTopAlbums', user: req.query.user, limit: 1000, page: req.query.pageNum}), function (error, response, body) {
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
      console.log('Last.fm API error - no top albums');
      res.status(500).json({error: 'Internal error.'});
    } else {
      res.status(200).json(JSON.parse(body).topalbums.album.map(album => ({artist: album.artist.name, name: album.name})));
    }
  });
}

function getNumArtists(req, res) {
  request(getOptions({method: 'user.getTopArtists', user: req.query.user, limit: 1}), function (error, response, body) {
    if (error) {
      console.log('Internal server error: ' + error);
      res.status(500).json({error: 'Internal error.'});
    } else if (response.statusCode != 200) {
      console.log('Last.fm API error in getNumArtists');
      let errMessage = 'Last.fm error';
      if (JSON.parse(body).message) {
        errMessage += ': ' + JSON.parse(body).message;
      }
      res.status(400).json({error: errMessage});
    } else {
      res.status(200).send(JSON.parse(body)['topartists']['@attr']['total']);
    }
  });
}

function getArtists(req, res) {
  request(getOptions({method: 'user.getTopArtists', user: req.query.user, limit: 1000, page: req.query.pageNum}), function (error, response, body) {
    if (error) {
      console.log('Internal server error: ' + error);
      res.status(500).json({error: 'Internal error.'});
    } else if (response.statusCode != 200) {
      console.log('Last.fm API error in getArtists');
      let errMessage = 'Last.fm error';
      if (JSON.parse(body).message) {
        errMessage += ': ' + JSON.parse(body).message;
      }
      res.status(400).json({error: errMessage});
    } else if (!JSON.parse(body).topartists) {
      console.log('Last.fm API error - no top artists');
      res.status(500).json({error: 'Internal error.'});
    } else {
      res.status(200).json(JSON.parse(body).topartists.artist.map(artist => artist.name));
    }
  });
}

app.get('/*', (req, res) => {
  let url = path.join(__dirname, './client/build', 'index.html');
  res.sendFile(url);
});

const port = process.env.PORT || 3001;
app.listen(port);

console.log(`Server listening on ${port}...`);