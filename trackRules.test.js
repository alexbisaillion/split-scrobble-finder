const rules = require('./rules');

describe('Check if the isDuplicateTrack method successfully detects duplicates', () => {
  test('Check if a track with an excess feature tag is a duplicate', () => {
    expect(rules.isDuplicateTrack('See You Again', 'See You Again (feat. Kali Uchis)')).toBe(true);
  });
  test('Check if a track with an extraneous tag and an excess feature tag is a duplicate', () => {
    expect(rules.isDuplicateTrack('Int\'l Players Anthem (I Choose You)', 'Int\'l Players Anthem (I Choose You) (feat. Outkast)')).toBe(true);
  });
  test('Check if a track with excess spaces is a duplicate ', () => {
    expect(rules.isDuplicateTrack('Vibin\' Out with ((( O )))' , 'Vibin\' out with (((O)))')).toBe(true);
  });
  test('Check if a track with an altered list of featured artists is a duplicate', () => {
    expect(rules.isDuplicateTrack('Izayah (feat. Key!, Maxo Kream & Denzel Curry)', 'Izayah (feat. Key!, Maxo Kream, Denzel Curry & Kenny Beats)')).toBe(true);
  });
  test('Check if a track with altered parentheses is a duplicate', () => {
    expect(rules.isDuplicateTrack('Never Bend (Remix) (feat. Lil Uzi Vert)', 'Never Bend (Remix) [feat. Lil Uzi Vert]')).toBe(true);
  });
  test('Check if a track with excess non alphanumeric characters is a duplicate', () => {
    expect(rules.isDuplicateTrack('V. 3005 (beach picnic version)', 'V. 3005 - Beach Picnic Version')).toBe(true);
  });
  test('Check if a track with excess abbreviation is a duplicate', () => {
    expect(rules.isDuplicateTrack('Drunk In L.A.', 'Drunk in LA')).toBe(true);
  });
  test('Check if interlude with different nonalphanumeric characters is a duplicate', () => {
    expect(rules.isDuplicateTrack('Brand New Tyga (Interlude)', 'Brand New Tyga - Interlude')).toBe(true);
  });
  test('Check if same track with different apostrophe is a duplicate', () => {
    expect(rules.isDuplicateTrack('You\'re Either On Something', 'You\’re Either On Something')).toBe(true);
  });
  test('Check if same track with different quotation marks is a duplicate', () => {
    expect(rules.isDuplicateTrack('1985 (Intro to \"The Fall Off\")', '1985 - Intro to “The Fall Off”')).toBe(true);
  });
  test('Check if track using feat instead of with is a duplicate', () => {
    expect(rules.isDuplicateTrack('Only 1 (Interlude) (with Travis Scott)', 'Only 1 (Interlude) [feat. Travis Scott]')).toBe(true);
  });
  test('Check if track using g-dropping is a duplicate', () => {
    expect(rules.isDuplicateTrack('Livin\' Underwater (Is Somethin\' Wild)', 'Livin’ Underwater (Is Something Wild)')).toBe(true);
  });
  test('FINISH EM ZEL | F1N1ZH EM ZEL', () => {
    expect(rules.isDuplicateTrack('SIRENS l Z1RENZ (feat. J.I.D)', 'SIRENS | Z1RENZ [FEAT. J.I.D | J.1.D]')).toBe(true);
  });
  test('Check if track with extra text is a duplicate', () => {
    expect(rules.isDuplicateTrack('Bedtime Stories (Feat. The Weeknd)', 'Bedtime Stories (feat. The Weeknd) - From SR3MM')).toBe(true);
  });
  test('Check if feature tags using different nonalphanumeric characters are duplicates', () => {
    expect(rules.isDuplicateTrack('Flying Overseas (feat. Devonte Hynes And Solange Knowles)', 'Flying Overseas - feat. Devonte Hynes And Solange Knowles')).toBe(true);
  });
  test('Check if remix with excess feature tag is a duplicate', () => {
    expect(rules.isDuplicateTrack('Drunk In Love Remix', 'Drunk In Love Remix (feat. Jay Z & Kanye West)')).toBe(true);
  });
  test('Check if extended version with excess feature tag is a duplicate', () => {
    expect(rules.isDuplicateTrack('Blessings (Extended Version) [feat. Drake & Kanye West]', 'Blessings - Extended Version')).toBe(true);
  });
  test('Check if repeated feature tag is a duplicate', () => {
    expect(rules.isDuplicateTrack('Palmolive (feat. Pusha T & Killer Mike)', 'Palmolive feat. Pusha T. & Killer Mike (feat. Pusha T & Killer Mike)')).toBe(true);
  });
  test('Check if tracks using different spelling of \'part\' are duplicates', () => {
    expect(rules.isDuplicateTrack('Girls, Girls, Girls (Part 2)', 'Girls, Girls, Girls, Pt. 2')).toBe(true);
  });
  test('Check if track using roman numerals is a duplicate', () => {
    expect(rules.isDuplicateTrack('Girls, Girls, Girls, Pt. 2', 'Girls, Girls, Girls, pt. II')).toBe(true);
  });
  test('Check if the same mix is a duplicate', () => {
    expect(rules.isDuplicateTrack('Hey Ya! (Radio Mix/Club Mix)', 'Hey Ya! - Radio Mix / Club Mix')).toBe(true);
  });
  test('Check if an ampersand instead of \'and\' is a duplicate', () => {
    expect(rules.isDuplicateTrack('Or Nah (feat. The Weeknd, Wiz Khalifa & DJ Mustard) - Remix', 'Or Nah (feat. The Weeknd, Wiz Khalifa and DJ Mustard) - Remix')).toBe(true);
  });
  test('Check if featured artists in different order is a duplicate', () => {
    expect(rules.isDuplicateTrack('100 Bands (feat. Quavo, 21 Savage, Meek Mill & YG)', '100 Bands (feat. Quavo, 21 Savage, YG & Meek Mill)')).toBe(true);
  });
  test('Check if abbreviation not using punctuation is a duplicate', () => {
    expect(rules.isDuplicateTrack('Operation Lifesaver a.k.a Mint Test', 'Operation Lifesaver aka Mint Test')).toBe(true);
  });
  test('Check if special character using different spacing is a duplicate', () => {
    expect(rules.isDuplicateTrack('Music: Response', 'Music:Response')).toBe(true);
  });
  test('Check if feature using \'featuring\' instead of \'feat\' is a duplicate', () => {
    expect(rules.isDuplicateTrack('Jailbreak the Tesla (feat. Aminé)', 'Jailbreak the Tesla featuring Aminé')).toBe(true);
  });
  test('Check if track with excess feature and a title with different casing is a duplicate', () => {
    expect(rules.isDuplicateTrack('PrimeTime', 'Primetime (feat. Miguel)')).toBe(true);
  });
});

describe('Check if the isDuplicateTrack method successfully detects non duplicates', () => {
  test('Check if tracks with numeric/non-numeric numbering with mismatching numbers are not duplicates', () => {
    expect(rules.isDuplicateTrack('Minus 3', 'Minus One')).toBe(false);
  });
  test('Check if tracks with numeric numbering with mismatching numbers are not duplicates', () => {
    expect(rules.isDuplicateTrack('The Birds Part 1', 'The Birds Part 2')).toBe(false);
  });
  test('Check if tracks with a single different word are not duplicates', () => {
    expect(rules.isDuplicateTrack('Starfruit LA', 'Starfruit NYC')).toBe(false);
  });
  test('Check if tracks with differing roman numerals are not duplicates', () => {
    expect(rules.isDuplicateTrack('Things That Are Bad for Me (Part I)', 'Things That Are Bad for Me (Part II)')).toBe(false);
  });
  test('Check if tracks with the same remastered tag are not duplicates', () => {
    expect(rules.isDuplicateTrack('Hotel California - Eagles 2013 Remaster', 'Peaceful Easy Feeling - Eagles 2013 Remaster')).toBe(false);
  });
  test('Check if an original mix and an edit are not duplicates', () => {
    expect(rules.isDuplicateTrack('Starry Night - Edit', 'Starry Night - Original Mix')).toBe(false);
  });
  test('Check if tracks with a single different word in parantheses is not a duplicate', () => {
    expect(rules.isDuplicateTrack('Bermondsey Bosom (Left)', 'Bermondsey Bosom (Right)')).toBe(false);
  });
  test('Check if the single version of a track is not a duplicate', () => {
    expect(rules.isDuplicateTrack('Somebody\'s Watching Me', 'Somebody\'s Watching Me - Single Version')).toBe(false);
  });
  test('Check if the same track remixed by different artists is not a duplicate', () => {
    expect(rules.isDuplicateTrack('Positive Contact - Bonus Track - Charlie Clouser Remix', 'Positive Contact - Bonus Track - Mario C Remix')).toBe(false);
  });
  test('Check if the same track remixed by different artists using \'with\' is not a duplicate', () => {
    expect(rules.isDuplicateTrack('OMG (with Carly Rae Jepsen) - Alphalove Remix', 'OMG (with Carly Rae Jepsen) - Anki Remix')).toBe(false);
  });
  test('Check if remix nested in feature tag is not a duplicate', () => {
    expect(rules.isDuplicateTrack('Genius (with Lil Wayne, Sia, Diplo & Labrinth - Lil Wayne Remix)', 'Genius (with Sia, Diplo & Labrinth)')).toBe(false);
  });
  test('Check if remix following feature tag is not a duplicate', () => {
    expect(rules.isDuplicateTrack('In Your Eyes (Feat. Charlotte Day Wilson)', 'In Your Eyes (feat. Charlotte Day Wilson) - Nosaj Thing Remix)')).toBe(false);
  });
  test('Check if a cappella version is not a duplicate', () => {
    expect(rules.isDuplicateTrack('Call Out My Name', 'Call Out My Name - A Cappella')).toBe(false);
  });
  test('Check if interlude with the same name is not a duplicate', () => {
    expect(rules.isDuplicateTrack('All of the Lights', 'All of the Lights (Interlude)')).toBe(false);
  });
  test('Check if instrumental version is not a duplicate', () => {
    expect(rules.isDuplicateTrack('In The City', 'In The City (Instrumental)')).toBe(false);
  });
  test('Check if reprise is not a duplicate', () => {
    expect(rules.isDuplicateTrack('Liability', 'Liability (Reprise)')).toBe(false);
  });
  test('Check if tracks with the same name but different featured artists are not duplicates', () => {
    expect(rules.isDuplicateTrack('waves (feat. Kacey Musgraves) - Remix', 'waves (feat. Travis Scott) - Remix')).toBe(false);
  });
  test('Check if interludes with similar names are not duplicates', () => {
    expect(rules.isDuplicateTrack('For Free? - Interlude', 'For Sale? (interlude)')).toBe(false);
  });
  test('Check if tracks with a name consisting of a single similar word are not duplicates', () => {
    expect(rules.isDuplicateTrack('Insecure', 'Insecurity')).toBe(false);
  });
  test('Check if different tracks with the same feature are not duplicates', () => {
    expect(rules.isDuplicateTrack('Atlantique Sud (feat. Mai Lan)', 'Bibi the Dog (feat. Mai Lan)')).toBe(false);
  });
  test('Check if a different mix of the same track is not a duplicate', () => {
    expect(rules.isDuplicateTrack('So Heavy I Fell Through the Earth - Algorithm Mix', 'So Heavy I Fell Through the Earth - Art Mix')).toBe(false);
  });
  test('Check if a continued song is not a duplicate', () => {
    expect(rules.isDuplicateTrack('Everything Now', 'Everything Now (continued)')).toBe(false);
  });
  test('Check if a remastered song is not a duplicate', () => {
    expect(rules.isDuplicateTrack('Smooth Criminal', 'Smooth Criminal - 2012 Remaster')).toBe(false);
  });
  test('Check if a remastered song is not a duplicate', () => {
    expect(rules.isDuplicateTrack('The Face Part I', 'The Face Part II')).toBe(false);
  });
  test('Check if an acoustic song is not a duplicate', () => {
    expect(rules.isDuplicateTrack('The Shade', 'The Shade - Acoustic')).toBe(false);
  });
  test('Check if the album version of a song is not a duplicate', () => {
    expect(rules.isDuplicateTrack('Tailwhip', 'Tailwhip (Album V)')).toBe(false);
  });
  test('Check if the album version of a song is not a duplicate', () => {
    expect(rules.isDuplicateTrack('Datwhip (interlude)', 'Dntstop (interlude)')).toBe(false);
  });
});
