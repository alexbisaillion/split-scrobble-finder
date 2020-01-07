const rules = require('./rules');

describe('Check if the isDuplicateAlbum method successfully detects duplicates', () => {
  test('Check if a deluxe album is a duplicate', () => {
    expect(rules.isDuplicateAlbum('Take Care', 'Take Care (Deluxe)', true)).toBe(true);
  });
  test('Check if an extended album is a duplicate', () => {
    expect(rules.isDuplicateAlbum('Pure Heroine (Extended)', 'Pure Heroine', true)).toBe(true);
  });
  test('Check if a single with excess feature tag is a duplicate', () => {
    expect(rules.isDuplicateAlbum('One Out Of Two', 'One Out Of Two (feat. Irfane)', true)).toBe(true);
  });
  test('Check if a single with features listed in different order is a duplicate', () => {
    expect(rules.isDuplicateAlbum('Watch (feat. Kanye West & Lil Uzi Vert)', 'Watch (feat. Lil Uzi Vert & Kanye West)', true)).toBe(true);
  });
  test('Check if a single with \'single\' listed in the title is a duplicate', () => {
    expect(rules.isDuplicateAlbum('This Is America', 'This Is America - Single', true)).toBe(true);
  });
  test('Check if an EP with \'EP\' listed in the title is a duplicate', () => {
    expect(rules.isDuplicateAlbum('Rogue Waves', 'Rogue Waves - EP', true)).toBe(true);
  });
  test('Check if an album with extra nonalphanumeric characters is a duplicate', () => {
    expect(rules.isDuplicateAlbum('Born to Die (The Paradise Edition)', 'Born to Die - The Paradise Edition', true)).toBe(true);
  });
  test('Check if a single with an excess feature tag listed as \'single\' is a duplicate', () => {
    expect(rules.isDuplicateAlbum('Drug Dealers Anonymous', 'Drug Dealers Anonymous (feat. JAY Z) - Single', true)).toBe(true);
  });
  test('Carly Slay Jepsen', () => {
    expect(rules.isDuplicateAlbum('E\u00b7MO\u00b7TION Side B', 'EMOTION SIDE B +', true)).toBe(true);
  });
  test('last dinos', () => {
    expect(rules.isDuplicateAlbum('In A Million Years', 'In A Million Years (Tour Edition)', true)).toBe(true);
  });
  test('Check if album with extra whitespace is a duplicate', () => {
    expect(rules.isDuplicateAlbum('Funk Wav Bounces Vol. 1', 'Funk Wav Bounces Vol.1', true)).toBe(true);
  });
  test('Check if the explicit version of an album is a duplicate', () => {
    expect(rules.isDuplicateAlbum('Man On The Moon II: The Legend Of Mr. Rager (Explicit Version)', 'Man On The Moon, Vol. II: The Legend Of Mr. Rager', true)).toBe(true);
  });
  test('Check if an album missing \'vol\' is a duplicate', () => {
    expect(rules.isDuplicateAlbum('Man On The Moon, Vol. II: The Legend Of Mr. Rager', 'Man on the Moon II: The Legend of Mr. Rager', true)).toBe(true);
  });
  test('Check if a deluxe version of an album is a duplicate', () => {
    expect(rules.isDuplicateAlbum('Sun Structures', 'Sun Structures (Deluxe Version)', true)).toBe(true);
  });
  test('Check if an album using an extra ellipsis is a duplicate', () => {
    expect(rules.isDuplicateAlbum('Magna Carta Holy Grail', 'Magna Carta... Holy Grail', true)).toBe(true);
  });
  test('Check if an album name with an extra article is a duplicate', () => {
    expect(rules.isDuplicateAlbum('Vol. 3: Life and Times of S. Carter', 'Vol. 3: The Life and Times of S. Carter', true)).toBe(true);
  });
  test('Check if a deluxe edition of an album is a duplicate', () => {
    expect(rules.isDuplicateAlbum('Everything You\'ve Come To Expect (Deluxe Edition)', 'Everything You\u2019ve Come To Expect', true)).toBe(true);
  });
  test('Check if an abbreviation without punctuation is a duplicate', () => {
    expect(rules.isDuplicateAlbum('Sept 5th', 'Sept. 5th', true)).toBe(true);
  });
  test('Check if an album listed as bonus track is a duplicate', () => {
    expect(rules.isDuplicateAlbum('The Bird Of Music', 'The Bird Of Music (Bonus Track)', true)).toBe(true);
  });
  test('Check if the expanded and deluxe edition of an album are duplicates', () => {
    expect(rules.isDuplicateAlbum('Hip Hop Is Dead (Deluxe Edition)', 'Hip Hop Is Dead (Expanded Edition)', true)).toBe(true);
  });
  test('Check if a \/ with different spacing is a duplicate', () => {
    expect(rules.isDuplicateAlbum('Speakerboxxx \/ The Love Below', 'Speakerboxxx\/The Love Below', true)).toBe(true);
  });
  test('Check if a special edition of an album is a duplicate', () => {
    expect(rules.isDuplicateAlbum('The Bones of What You Believe', 'The Bones of What You Believe (Special Edition)', true)).toBe(true);
  });
  test('Check if an expanded edition marked in square brackets is a duplicate', () => {
    expect(rules.isDuplicateAlbum('Enter The Wu-Tang (36 Chambers) [Expanded Edition]', 'Enter the Wu-Tang (36 Chambers)', true)).toBe(true);
  });
});

describe('Check if the isDuplicateAlbum method successfully detects non duplicates', () => {
  test('Check if an album of instrumentals is not a duplicate', () => {
    expect(rules.isDuplicateAlbum('Cherry Bomb', 'Cherry Bomb + Instrumentals', true)).toBe(false);
  });
  test('Check if the b sides for two different albums are not duplicates', () => {
    expect(rules.isDuplicateAlbum('Currents B-Sides & Remixes', 'InnerSpeaker B-Sides & Remixes', true)).toBe(false);
  });
  test('Check if the solo version of a single is not a duplicate', () => {
    expect(rules.isDuplicateAlbum('Biking', 'Biking (Solo)', true)).toBe(false);
  });
  test('Check if the b side of an album is not a duplicate', () => {
    expect(rules.isDuplicateAlbum('E\u00b7MO\u00b7TION', 'E\u00b7MO\u00b7TION Side B', true)).toBe(false);
  });
  test('Check if a remix album is not a duplicate', () => {
    expect(rules.isDuplicateAlbum('Human After All', 'Human After All (Remixes)', true)).toBe(false);
  });
  test('Check if different remixes of a single are not duplicates', () => {
    expect(rules.isDuplicateAlbum('Don\'t Leave Me Lonely (Claptone Remix)', 'Don\'t Leave Me Lonely (Purple Disco Machine Remix)', true)).toBe(false);
  });
  test('Check if a remix of a single is not a duplicate', () => {
    expect(rules.isDuplicateAlbum('Late Night Feelings', 'Late Night Feelings (Channel Tres Remix)', true)).toBe(false);
  });
  test('Check if the sequel to an album using numeric characters is not a duplicate', () => {
    expect(rules.isDuplicateAlbum('Luv Is Rage', 'Luv Is Rage 2', true)).toBe(false);
  });
  test('Check if the sequel to an album using roman numerals is not a duplicate', () => {
    expect(rules.isDuplicateAlbum('Culture', 'Culture II', true)).toBe(false);
  });
  test('Check if the sequel to an album using written words is not a duplicate', () => {
    expect(rules.isDuplicateAlbum('PARTYNEXTDOOR', 'PARTYNEXTDOOR TWO', true)).toBe(false);
  });
  test('Check if two different volumes of an album using roman numerals are not duplicates', () => {
    expect(rules.isDuplicateAlbum('Superclean, Vol. I', 'Superclean, Vol. II', true)).toBe(false);
  });
  test('Check if an edit of a single is not a duplicate', () => {
    expect(rules.isDuplicateAlbum('Better Now', 'Better Now (Edit)', true)).toBe(false);
  });
  test('Check if two soundtracks by the same artist are not duplicates', () => {
    expect(rules.isDuplicateAlbum('Blade Runner 2049 (Original Motion Picture Soundtrack)', 'The Dark Knight (Collectors Edition) [Original Motion Picture Soundtrack]', true)).toBe(false);
  });
  test('Check if single remixes by two different artists are not duplicates', () => {
    expect(rules.isDuplicateAlbum('Lightenup (Alex Metric Remix)', 'Lightenup (Breakbot Remix)', true)).toBe(false);
  });
  test('Check if a remix EP is not a duplicate', () => {
    expect(rules.isDuplicateAlbum('For All We Know', 'For All We Know - The Remixes - EP', true)).toBe(false);
  });
  test('Check if a live album is not a duplicate', () => {
    expect(rules.isDuplicateAlbum('Carrie & Lowell', 'Carrie & Lowell Live', true)).toBe(false);
  });
  test('Check if a live album is not a duplicate', () => {
    expect(rules.isDuplicateAlbum('88GLAM RELOADED', '88GLAM2', true)).toBe(false);
  });
  test('Check an album with \'ep\' in it without actually being an EP is not a duplicate', () => {
    expect(rules.isDuplicateAlbum('The Blueprint', 'The Blueprint 2: The Gift & the Curse', true)).toBe(false);
  });
});
