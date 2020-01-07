const rules = require('./rules');

describe('Check if the isDuplicateArtist method successfully detects duplicates', () => {
  test('Check if an artist contained in a \'&\' separated list of two artists is a duplicate', () => {
    expect(rules.isDuplicateArtist('21 Savage', '21 Savage & Metro Boomin', true)).toBe(true);
  });
  test('Check if an artist contained in a \',\' separated list of two artists is a duplicate', () => {
    expect(rules.isDuplicateArtist('Silk City', 'Silk City, Dua Lipa', true)).toBe(true);
  });
  test('Check if an artist contained in two \'&\' separated lists of artists is a duplicate', () => {
    expect(rules.isDuplicateArtist('Calvin Harris & Alesso', 'Calvin Harris & Disciples', true)).toBe(true);
  });
  test('Check if an artist contained in one \'&\' and one \',\' separated lists of artists is a duplicate', () => {
    expect(rules.isDuplicateArtist('Calvin Harris & Disciples', 'Calvin Harris, Dua Lipa', true)).toBe(true);
  });
  test('Check if an artist contained in a list of 3 artists is a duplicate', () => {
    expect(rules.isDuplicateArtist('Ellie Goulding', 'Ellie Goulding, Diplo & Swae Lee', true)).toBe(true);
  });
  test('Check if an artist contained in two large lists is a duplicate', () => {
    expect(rules.isDuplicateArtist('Kanye West, Big Sean, Pusha T & 2 Chainz', 'Kanye West, Chief Keef, Pusha T, Big Sean & Jadakiss', true)).toBe(true);
  });
  test('Check if an artist contained in a list of two artists and a list of three artists is a duplicate', () => {
    expect(rules.isDuplicateArtist('Lil Baby & Gunna', 'Lil Baby, Gunna & Drake', true)).toBe(true);
  });
  test('Potato Salad', () => {
    expect(rules.isDuplicateArtist('Tyler, the Creator', 'Tyler, The Creator & A$AP Rocky', true)).toBe(true);
  });
});

describe('Check if the isDuplicateArtist method successfully detects non duplicates', () => {
  test('Check if different artists with one matching the beginning of the other are not duplicates', () => {
    expect(rules.isDuplicateArtist('America', 'American Football', true)).toBe(false);
  });
  test('Check if different artists with with the same first name are not duplicates', () => {
    expect(rules.isDuplicateArtist('Anthony Green', 'Anthony Naples', true)).toBe(false);
  });
  test('Check if an artist with only first name is not a duplicate of another artist with same first name and a last name', () => {
    expect(rules.isDuplicateArtist('Arthur', 'Arthur Brown', true)).toBe(false);
  });
  test('Check if an artist with only first name is not a duplicate of another artist with same first name and a last name', () => {
    expect(rules.isDuplicateArtist('Desire', 'Desired', true)).toBe(false);
  });
});
