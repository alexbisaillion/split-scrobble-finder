const stringSimilarity = require('string-similarity');
const featKeywords = ['feat. ', 'feat ', 'ft. ', 'ft ', 'with ', 'featuring '];
const romanNumVals = { m: 1000, f: 500, c: 100, l: 50, x: 10, v: 5, i: 1 };

function isDuplicateTrack(track1, track2) {
  //console.log(track1 + ' vs ' + track2);
  if (isExempt(track1, track2, ['remix', 'mix', 'instrumental', 'live', 'edit', 'alt', 'demo', 'version', 'a cappella', 'interlude', 'reprise', 'continued', 'remaster', 'single', 'acoustic'])) {
    return false;
  }
  return isMatched(track1, track2);
}

function isExempt(track1, track2, exemptKeywords) {
  for (keyword of exemptKeywords) {
    let isTrack1Matched = track1.toLowerCase().includes(keyword.toLowerCase());
    let isTrack2Matched = track2.toLowerCase().includes(keyword.toLowerCase());
    if ((isTrack1Matched && !isTrack2Matched) || (isTrack2Matched && !isTrack1Matched)) {
      return true;
    }
  }
  return false;
}

function isMatched(track1, track2) {
  track1 = track1.toLowerCase();
  track2 = track2.toLowerCase();

  if (containsFeatureTag(track1) && containsFeatureTag(track2)) {
    let track1Features = getFeaturedArtists(track1);
    let track2Features = getFeaturedArtists(track2);
    if (track1Features && track2Features && stringSimilarity.compareTwoStrings(track1Features, track2Features) < 0.5) {
      //console.log(stringSimilarity.compareTwoStrings(track1Features, track2Features));
      return false;
    }
  }

  track1 = stripNonAlphaNumeric(track1);
  track2 = stripNonAlphaNumeric(track2);

  track1 = stripExcessWhitespace(track1);
  track2 = stripExcessWhitespace(track2);

  track1 = stripFeatureTag(track1);
  track2 = stripFeatureTag(track2);
  
  let words = getWords(track1, track2);
  let split1 = words.split1;
  let split2 = words.split2;

  if (split1.length != split2.length) {
    return false;
  }

  for (let i = 0; i < split1.length; i++) {
    if (!isNaN((split1[i])) && !isNaN(split2[i]) && split1[i] != split2[i]) {
      return false;
    }
    if (!isNaN(split1[i]) && isNaN(split2[i])) {
      if (isRomanNum(split2[i]) && convertRomanNumToInt(split2[i]) === parseInt(split1[i])) {
        continue;
      }
    }
    if (isNaN(split1[i]) && !isNaN(split2[i])) {
      if (isRomanNum(split1[i]) && convertRomanNumToInt(split1[i]) === parseInt(split2[i])) {
        continue;
      }
    }
    if ((split1[i] === 'pt' || split1[i] === 'part') && (split2[i] === 'pt' || split2[i] === 'part')) {
      continue;
    }
    if (stringSimilarity.compareTwoStrings(split1[i], split2[i]) < 0.80) {
      return false;
    }
  }
  return true;
}

function stripNonAlphaNumeric(track) {
  track = track.replace(/:|\//g,' '); // it is likely that a slash or a colon separates two words, so the words should be kept separate
  return track.replace(/[^A-Za-z0-9\s]/g, '');
}

function stripExcessWhitespace(track) {
  return track.replace(/\s\s+/g, ' ').trim();
}

function getWords(track1, track2) {
  let split1 = track1.split(' ');
  let split2 = track2.split(' ');

  let length = split1.length > split2.length ? split1.length : split2.length;
  for (let i = 0; i < length; i++) {
    if (!split1[i] || !split2[i]) {
      break;
    }
    if (split1[i].length < 2 && split2[i].length >= 2) {
      if (split1[i + 1] && stringSimilarity.compareTwoStrings(split1[i + 1], split2[i]) > 0.9) {
        //console.log(split1[i] + ' !!! ' + track1);
        split1.splice(i, 1);
        i--;  
      }
    } else if (split2[i].length < 2 && split1[i].length >= 2) {
      if (split2[i + 1] && stringSimilarity.compareTwoStrings(split2[i + 1], split1[i]) > 0.9) {
        //console.log(split2[i] + ' !!! ' + track2);
        split2.splice(i, 1);
        i--;  
      }
    }
  }
  return { split1: split1, split2: split2 };
}

function containsFeatureTag(track) {
  for (let featKeyword of featKeywords) {
    if (track.includes(featKeyword)) {
      return true;
    }
  }
  return false;
}

function getFeaturedArtists(track) {
  if (track.includes('(') || track.includes('[')) {
    let matches = [];
    let roundBracketMatches = track.match(/\(([^)]+)\)/g);
    if (roundBracketMatches) {
      matches.push(...roundBracketMatches);
    }
    let squareBracketMatches = track.match(/\[(.*?)\]/g);
    if (squareBracketMatches) {
      matches.push(...squareBracketMatches);
    }
    for (let match of matches) {
      for (let featKeyword of featKeywords) {
        if (match.includes(featKeyword)) {
          return match.replace(featKeyword, '').replace(/\[|\]|\(|\)/g,'');
        }
      }
    }
  } else {
    for (let featKeyword of featKeywords) {
      if (track.includes(featKeyword)) {
        return track.substring(track.indexOf(featKeyword) + featKeyword.length, track.length);
      }
    }
  }
}

function stripFeatureTag(track) {
  if (track.includes(' feat ')) {
    track = track.substring(0, track.indexOf(' feat '));
  } else if (track.includes(' ft ')) {
    track = track.substring(0, track.indexOf(' feat '));
  } else if (track.includes(' with ')) {
    track = track.substring(0, track.indexOf(' with '));
  } else if (track.includes(' featuring ')) {
    track = track.substring(0, track.indexOf(' featuring '));
  }
  return track;
}

function isRomanNum(num) {
  if (num === null || !(typeof num[Symbol.iterator] === 'function')) {
    return false;
  }
  for (let char of num) {
    if (!(char in romanNumVals)) {
      return false;
    }
  }
  return true;
}

function convertRomanNumToInt(romanNum) {
  let reducer = (acc, cur, idx, src) => acc + (romanNumVals[cur] < romanNumVals[src[idx + 1]] ? -romanNumVals[cur] : romanNumVals[cur]);
  return romanNum.split('').reduce(reducer, 0);
}

module.exports = isDuplicateTrack;
