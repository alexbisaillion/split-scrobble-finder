const isDuplicateTrack = require('./trackRules');

describe('Check if the isDuplicateTrack method successfully detects duplicates', () => {
  test('Check if a track with an excess feature tag is a duplicate', () => {
    expect(isDuplicateTrack('See You Again', 'See You Again (feat. Kali Uchis)')).toBe(true);
  });
  test('Check if a track with an extraneous tag and an excess feature tag is a duplicate', () => {
    expect(isDuplicateTrack('Int\'l Players Anthem (I Choose You)', 'Int\'l Players Anthem (I Choose You) (feat. Outkast)')).toBe(true);
  });
  test('Check if a track with excess spaces is a duplicate ', () => {
    expect(isDuplicateTrack('Vibin\' Out with ((( O )))' , 'Vibin\' out with (((O)))')).toBe(true);
  });
  test('Check if a track with an altered list of featured artists is a duplicate', () => {
    expect(isDuplicateTrack('Izayah (feat. Key!, Maxo Kream & Denzel Curry)', 'Izayah (feat. Key!, Maxo Kream, Denzel Curry & Kenny Beats)')).toBe(true);
  });
  test('Check if a track with altered parentheses is a duplicate', () => {
    expect(isDuplicateTrack('Never Bend (Remix) (feat. Lil Uzi Vert)', 'Never Bend (Remix) [feat. Lil Uzi Vert]')).toBe(true);
  });
  test('Check if a track with excess non alphanumeric characters is a duplicate', () => {
    expect(isDuplicateTrack('V. 3005 (beach picnic version)', 'V. 3005 - Beach Picnic Version')).toBe(true);
  });
  test('Check if a track with excess abbreviation is a duplicate', () => {
    expect(isDuplicateTrack('Drunk In L.A.', 'Drunk in LA')).toBe(true);
  });
  test('Check if interlude with different nonalphanumeric characters is a duplicate', () => {
    expect(isDuplicateTrack('Brand New Tyga (Interlude)', 'Brand New Tyga - Interlude')).toBe(true);
  });
  test('Check if same track with different apostrophe is a duplicate', () => {
    expect(isDuplicateTrack('You\'re Either On Something', 'You\’re Either On Something')).toBe(true);
  });
  test('Check if same track with different quotation marks is a duplicate', () => {
    expect(isDuplicateTrack('1985 (Intro to \"The Fall Off\")', '1985 - Intro to “The Fall Off”')).toBe(true);
  });
  test('Check if track using feat instead of with is a duplicate', () => {
    expect(isDuplicateTrack('Only 1 (Interlude) (with Travis Scott)', 'Only 1 (Interlude) [feat. Travis Scott]')).toBe(true);
  });
  test('Check if track using g-dropping is a duplicate', () => {
    expect(isDuplicateTrack('Livin\' Underwater (Is Somethin\' Wild)', 'Livin’ Underwater (Is Something Wild)')).toBe(true);
  });
  test('FINISH EM ZEL | F1N1ZH EM ZEL', () => {
    expect(isDuplicateTrack('SUPER SAIYAN SUPERMAN l ZUPER ZA1YAN ZUPERMAN', 'SUPER SAIYAN SUPERMAN | ZUPER ZA1YAN ZUPERMAN')).toBe(true);
  }); 
});

describe('Check if the isDuplicateTrack method successfully detects non duplicates', () => {
  test('Check if tracks with numeric/non-numeric numbering with mismatching numbers are not duplicates', () => {
    expect(isDuplicateTrack('Minus 3', 'Minus One')).toBe(false);
  });
  test('Check if tracks with numeric numbering with mismatching numbers are not duplicates', () => {
    expect(isDuplicateTrack('The Birds Part 1', 'The Birds Part 2')).toBe(false);
  });
  test('Check if tracks with a single different word are not duplicates', () => {
    expect(isDuplicateTrack('Starfruit LA', 'Starfruit NYC')).toBe(false);
  });
  test('Check if tracks with differing roman numerals are not duplicates', () => {
    expect(isDuplicateTrack('Things That Are Bad for Me (Part I)', 'Things That Are Bad for Me (Part II)')).toBe(false);
  });
  test('Check if tracks with the same remastered tag are not duplicates', () => {
    expect(isDuplicateTrack('Hotel California - Eagles 2013 Remaster', 'Peaceful Easy Feeling - Eagles 2013 Remaster')).toBe(false);
  });
  test('Check if an original mix and an edit are not duplicates', () => {
    expect(isDuplicateTrack('Starry Night - Edit', 'Starry Night - Original Mix')).toBe(false);
  });
  test('Check if tracks with a single different word in parantheses is not a duplicate', () => {
    expect(isDuplicateTrack('Bermondsey Bosom (Left)', 'Bermondsey Bosom (Right)')).toBe(false);
  });
  test('Check if the single version of a track is not a duplicate', () => {
    expect(isDuplicateTrack('Somebody\'s Watching Me', 'Somebody\'s Watching Me - Single Version')).toBe(false);
  });
  test('Check if the same track remixed by different artists is not a duplicate', () => {
    expect(isDuplicateTrack('Positive Contact - Bonus Track - Charlie Clouser Remix', 'Positive Contact - Bonus Track - Mario C Remix')).toBe(false);
  });
  test('Check if remix nested in feature tag is not a duplicate', () => {
    expect(isDuplicateTrack('Genius (with Lil Wayne, Sia, Diplo & Labrinth - Lil Wayne Remix)', 'Genius (with Sia, Diplo & Labrinth)')).toBe(false);
  });
  test('Check if remix following feature tag is not a duplicate', () => {
    expect(isDuplicateTrack('In Your Eyes (Feat. Charlotte Day Wilson)', 'In Your Eyes (feat. Charlotte Day Wilson) - Nosaj Thing Remix)')).toBe(false);
  });
  test('Check if a cappella version is not a duplicate', () => {
    expect(isDuplicateTrack('Call Out My Name', 'Call Out My Name - A Cappella')).toBe(false);
  });
  test('Check if interlude with the same name is not a duplicate', () => {
    expect(isDuplicateTrack('All of the Lights', 'All of the Lights (Interlude)')).toBe(false);
  });
  test('Check if instrumental version is not a duplicate', () => {
    expect(isDuplicateTrack('In The City', 'In The City (Instrumental)')).toBe(false);
  });
  test('Check if reprise is not a duplicate', () => {
    expect(isDuplicateTrack('Liability', 'Liability (Reprise)')).toBe(false);
  });
  test('Check if tracks with the same name but different featured artists are not duplicates', () => {
    expect(isDuplicateTrack('waves (feat. Kacey Musgraves) - Remix', 'waves (feat. Travis Scott) - Remix')).toBe(false);
  });
  test('Check if interludes with similar names are not duplicates', () => {
    expect(isDuplicateTrack('For Free? - Interlude', 'For Sale? (interlude)')).toBe(false);
  });
  test('Check if tracks with a name consisting of a single similar word are not duplicates', () => {
    expect(isDuplicateTrack('Loca', 'Loco')).toBe(false);
  });
});
