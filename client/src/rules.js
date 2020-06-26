import { compareTwoStrings } from 'string-similarity';
const featKeywords = ['feat. ', 'feat ', 'ft. ', 'ft ', 'with ', 'featuring '];
const romanNumVals = { m: 1000, f: 500, c: 100, l: 50, x: 10, v: 5, i: 1 };
const exemptKeywords = ['remix', 'mix', 'instrumental', 'live', 'edit', 'alt', 'demo', 'version', 'a cappella', 'interlude', 'reprise', 'continued', 'single', 'acoustic'];
const albumKeywords = ['deluxe', 'expanded', 'extended', 'single', ' ep', 'tour edition', 'explicit version', 'deluxe version', 'expanded version', 'extended version', 'deluxe edition', 'expanded edition', 'extended edition', 'bonus track', 'special edition'];

export function isDuplicateTrack(track1, track2, useRules) {
  if (!useRules) {
    return compareTwoStrings(track1, track2) > 0.5;
  }

  track1 = track1.toLowerCase();
  track2 = track2.toLowerCase();
  if (compareTwoStrings(track1, track2) < 0.5) {
    if (!track1.startsWith(track2) && !track2.startsWith(track1)) {
      return false;
    }
  }
  if (isExempt(track1, track2, exemptKeywords)) {
    return false;
  }
  return isMatched(track1, track2);
}

export function isDuplicateAlbum(album1, album2, useRules) {
  if (!useRules) {
    return compareTwoStrings(album1, album2) > 0.5;
  }
  
  album1 = album1.toLowerCase();
  album2 = album2.toLowerCase();

  album1 = stripAlbumTag(album1);
  album2 = stripAlbumTag(album2);

  if (compareTwoStrings(album1, album2) < 0.5) {
    if (!album1.startsWith(album2) && !album2.startsWith(album1)) {
      return false;
    }
  }
  if (isExempt(album1, album2, exemptKeywords)) {
    return false;
  }
  return isMatched(album1, album2);
}

export function isDuplicateArtist(artist1, artist2, useRules) {
  if (!useRules) {
    return compareTwoStrings(artist1, artist2) > 0.5;
  }

  artist1 = artist1.toLowerCase();
  artist2 = artist2.toLowerCase();

  if (compareTwoStrings(artist1, artist2) < 0.5) {
    if (!artist1.startsWith(artist2) && !artist2.startsWith(artist1)) {
      return false;
    }
  }

  if (analyzeArtistList(artist1, artist2)) {
    return true;
  }
  return isMatched(artist1, artist2);
}

function isExempt(track1, track2, exemptKeywords) {
  for (let keyword of exemptKeywords) {
    let isTrack1Matched = track1.includes(keyword);
    let isTrack2Matched = track2.includes(keyword);
    if ((isTrack1Matched && !isTrack2Matched) || (isTrack2Matched && !isTrack1Matched)) {
      return true;
    }
  }
  return false;
}

function isMatched(str1, str2) {
  let track1Features;
  if (containsFeatureTag(str1)) {
    track1Features = getFeaturedArtists(str1);
  }

  let track2Features;
  if (containsFeatureTag(str2)) {
    track2Features = getFeaturedArtists(str2);
  }

  if (track1Features && track2Features) {
    if (compareTwoStrings(track1Features, track2Features) < 0.5) {
      return false;
    }

    let excess1 = str1.replace(track1Features, '');
    let excess2 = str2.replace(track2Features, '');

    excess1 = stripNonAlphaNumeric(excess1);
    excess2 = stripNonAlphaNumeric(excess2);
  
    excess1 = stripExcessWhitespace(excess1);
    excess2 = stripExcessWhitespace(excess2);
    
    if (excess1 && excess2 && !analyzeFeatureTagExcess(excess1, excess2)) {
      return false;
    }
  }

  str1 = stripNonAlphaNumeric(str1);
  str2 = stripNonAlphaNumeric(str2);

  str1 = stripRemasteredTag(str1);
  str2 = stripRemasteredTag(str2);

  str1 = stripFeatureTag(str1);
  str2 = stripFeatureTag(str2);

  str1 = stripExcessWhitespace(str1);
  str2 = stripExcessWhitespace(str2);

  let words = getWords(str1, str2);

  if (words.split1.length === 1 && words.split2.length === 1) {
    return words.split1[0] === words.split2[0];
  }
  return analyzeWords(words.split1, words.split2);
}

function stripNonAlphaNumeric(str) {
  str = str.replace(/:|\//g,' '); // it is likely that a slash or a colon separates two words, so the words should be kept separate
  return str.replace(/[^A-Za-z0-9\s]/g, '');
}

function stripExcessWhitespace(str) {
  return str.replace(/\s\s+/g, ' ').trim();
}

function getWords(str1, str2) {
  let split1 = str1.split(' ');
  let split2 = str2.split(' ');

  let length = split1.length > split2.length ? split1.length : split2.length;
  // Search for extraneous words within the string, starting at the second word
  for (let i = 0; i < length; i++) {
    if (!split1[i] || !split2[i]) {
      break;
    }

    if (compareTwoStrings(split1[i], split2[i]) < 0.5) {
      if (split1[i + 1] && compareTwoStrings(split1[i + 1], split2[i]) > compareTwoStrings(split1[i], split2[i]) && !exemptKeywords.includes(split1[i + 1])) {
        split1.splice(i, 1);
        i--;
      } else if (split2[i + 1] && compareTwoStrings(split2[i + 1], split1[i]) > compareTwoStrings(split2[i], split1[i]) && !exemptKeywords.includes(split2[i + 1])) {
        split2.splice(i, 1);
        i--;  
      }
    }
  }
  return { split1: split1, split2: split2 };
}

function analyzeWords(split1, split2) {
  if (split1.length !== split2.length) {
    return false;
  }

  for (let i = 0; i < split1.length; i++) {
    if (!isNaN((split1[i])) && !isNaN(split2[i]) && split1[i] !== split2[i]) {
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

    if (compareTwoStrings(split1[i], split2[i]) < 0.80) {
      return false;
    }
  }
  return true;
}

function containsFeatureTag(str) {
  for (let featKeyword of featKeywords) {
    if (str.includes(featKeyword)) {
      return true;
    }
  }
  return false;
}

function getFeaturedArtists(str) {
  if (str.includes('(') || str.includes('[')) {
    let matches = [];
    let roundBracketMatches = str.match(/\(([^)]+)\)/g);
    if (roundBracketMatches) {
      matches.push(...roundBracketMatches);
    }
    let squareBracketMatches = str.match(/\[(.*?)\]/g);
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
      if (str.includes(featKeyword)) {
        return str.substring(str.indexOf(featKeyword) + featKeyword.length, str.length);
      }
    }
  }
}

function stripFeatureTag(str) {
  for (let featKeyword of [' feat ', ' ft ', ' with ', ' featuring ']) {
    if (str.includes(featKeyword)) {
      str = str.substring(0, str.indexOf(featKeyword));
      break;
    }
  }
  return str;
}

function stripRemasteredTag(str) {
  for (let remasteredKeyword of ['remastered', 'remaster']) {
    if (str.includes(remasteredKeyword)) {
      str = str.substring(0, str.indexOf(remasteredKeyword));
      str = stripYears(str);
      break;
    }
  }
  return str;
}

function stripYears(str) {
  return str.replace(/\s*\b\d{4}\b/g, '');
}

function analyzeFeatureTagExcess(str1, str2) {
  let cutoff1;
  let cutoff2;
  for (let featKeyword of featKeywords) {
    if (str1.includes(featKeyword)) {
      cutoff1 = str1.substring(str1.indexOf(featKeyword) + featKeyword.length, str1.length);
    }
    if (str2.includes(featKeyword)) {
      cutoff2 = str2.substring(str2.indexOf(featKeyword) + featKeyword.length, str2.length);
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

function stripAlbumTag(str) {
  for (let albumTag of albumKeywords) {
    if (str.includes(albumTag)) {
      str = str.substring(0, str.indexOf(albumTag));
      break;
    }
  }
  str = str.replace('vol.', '');
  return str; 
}

function analyzeArtistList(artist1, artist2) {
  let isArtist1List = artist1.includes('&') || artist1.includes(',');
  let isArtist2List = artist2.includes('&') || artist2.includes(',');
  if (isArtist1List) {
    let artists1 = artist1.split(/,|&/g).map(str => stripExcessWhitespace(str));
    if (isArtist2List) {
      let artists2 = stripExcessWhitespace(artist2).split(/,|&/g).map(str => stripExcessWhitespace(str));
      if (artists1.filter(artist => artists2.includes(artist)).length > 0) {
        return true;
      }
    } else {
      if (artists1.includes(artist2)) {
        return true;
      }
    }
  } else if (isArtist2List) {
    let artists2 = stripExcessWhitespace(artist2).split(/,|&/g).map(str => stripExcessWhitespace(str));
    if (artists2.includes(artist1)) {
      return true;
    }
  }
  return false;
}
