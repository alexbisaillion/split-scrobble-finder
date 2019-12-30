const stringSimilarity = require('string-similarity');
const featKeywords = ['feat. ', 'feat ', 'ft. ', 'ft ', 'with ', 'featuring '];
const romanNumVals = { m: 1000, f: 500, c: 100, l: 50, x: 10, v: 5, i: 1 };

function isDuplicateTrack(track1, track2) {
  if (stringSimilarity.compareTwoStrings(track1, track2) < 0.5) {
    if (!track1.startsWith(track2) && !track2.startsWith(track1)) {
      return false;
    }
  }
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

  let track1Features;
  if (containsFeatureTag(track1)) {
    track1Features = getFeaturedArtists(track1);
  }

  let track2Features;
  if (containsFeatureTag(track2)) {
    track2Features = getFeaturedArtists(track2);
  }

  if (track1Features && track2Features) {
    if (stringSimilarity.compareTwoStrings(track1Features, track2Features) < 0.5) {
      return false;
    }

    let excess1 = track1.replace(track1Features, '');
    let excess2 = track2.replace(track2Features, '');

    excess1 = stripNonAlphaNumeric(excess1);
    excess2 = stripNonAlphaNumeric(excess2);
  
    excess1 = stripExcessWhitespace(excess1);
    excess2 = stripExcessWhitespace(excess2);
    
    if (excess1 && excess2 && !analyzeFeatureTagExcess(excess1, excess2)) {
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

  if (!analyzeWords(words.split1, words.split2)) {
    return false;
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
        split1.splice(i, 1);
        i--;  
      }
    } else if (split2[i].length < 2 && split1[i].length >= 2) {
      if (split2[i + 1] && stringSimilarity.compareTwoStrings(split2[i + 1], split1[i]) > 0.9) {
        split2.splice(i, 1);
        i--;  
      }
    }
  }
  return { split1: split1, split2: split2 };
}

function analyzeWords(split1, split2) {
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

    //console.log(split1[i] + ', ' + split2[i] + ', ' + stringSimilarity.compareTwoStrings(split1[i], split2[i]));
    if (stringSimilarity.compareTwoStrings(split1[i], split2[i]) < 0.80) {
      return false;
    }
  }
  return true;
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
  for (let featKeyword of [' feat ', ' ft ', ' with ', ' featuring ']) {
    if (track.includes(featKeyword)) {
      track = track.substring(0, track.indexOf(featKeyword));
      break;
    }
  }
  return track;
}

function analyzeFeatureTagExcess(track1, track2) {
  let cutoff1;
  let cutoff2;
  for (let featKeyword of featKeywords) {
    if (track1.includes(featKeyword)) {
      cutoff1 = track1.substring(track1.indexOf(featKeyword) + featKeyword.length, track1.length);
    }
    if (track2.includes(featKeyword)) {
      cutoff2 = track2.substring(track2.indexOf(featKeyword) + featKeyword.length, track2.length);
    }
  }

  if (cutoff1 && cutoff2) {
    let words = getWords(cutoff1, cutoff2);
    if (!analyzeWords(words.split1, words.split2)) {
      return false;
    }
  }
  return true;
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
