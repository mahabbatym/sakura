import axios from 'axios';
import fs from 'fs';

const targets = [
  { title: 'Blinding Lights', artists: ['The Weeknd'], query: 'The Weeknd Blinding Lights' },
  { title: 'Sweater Weather', artists: ['The Neighbourhood'], query: 'The Neighbourhood Sweater Weather' },
  { title: 'Starboy', artists: ['The Weeknd', 'Daft Punk'], query: 'The Weeknd Daft Punk Starboy' },
  { title: 'As It Was', artists: ['Harry Styles'], query: 'Harry Styles As It Was' },
  { title: 'Someone You Loved', artists: ['Lewis Capaldi'], query: 'Lewis Capaldi Someone You Loved' },
  { title: 'One Dance', artists: ['Drake', 'Wizkid', 'Kyla'], query: 'Drake Wizkid Kyla One Dance' },
  { title: 'STAY', artists: ['The Kid LAROI', 'Justin Bieber'], query: 'The Kid LAROI Justin Bieber STAY' },
  { title: 'Believer', artists: ['Imagine Dragons'], query: 'Imagine Dragons Believer' },
  { title: 'lovely', artists: ['Billie Eilish', 'Khalid'], query: 'Billie Eilish Khalid lovely' },
  { title: 'Yellow', artists: ['Coldplay'], query: 'Coldplay Yellow' },
  { title: 'The Night We Met', artists: ['Lord Huron'], query: 'Lord Huron The Night We Met' },
  { title: 'Riptide', artists: ['Vance Joy'], query: 'Vance Joy Riptide' },
  { title: 'Die With A Smile', artists: ['Lady Gaga', 'Bruno Mars'], query: 'Lady Gaga Bruno Mars Die With A Smile' },
  { title: 'Ordinary', artists: ['Alex Warren'], query: 'Alex Warren Ordinary' },
  { title: 'back to friends', artists: ['sombr'], query: 'sombr back to friends' },
];

const normalize = (value) => String(value || '')
  .toLowerCase()
  .replace(/[’']/g, '')
  .replace(/[^a-z0-9а-яёқңғүұһәі\s]/gi, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const matchesTarget = (item, target) => {
  const title = normalize(item.trackName);
  const wantedTitle = normalize(target.title);
  const artist = normalize(item.artistName);

  const titleMatches = title === wantedTitle || title.startsWith(`${wantedTitle} `);
  const artistMatches = target.artists.every((name) => artist.includes(normalize(name)));

  return titleMatches && artistMatches;
};

const searchItunes = async (target) => {
  const response = await axios.get('https://itunes.apple.com/search', {
    params: {
      term: target.query,
      media: 'music',
      entity: 'song',
      limit: 10,
      country: 'US',
    },
    headers: {
      'User-Agent': 'SakuraTopSongsSeeder/1.0',
      Accept: 'application/json',
    },
  });

  const match = response.data.results.find((item) => matchesTarget(item, target));
  if (!match) return null;

  return {
    title: match.trackName,
    artist: match.artistName,
    album: match.collectionName,
    cover: match.artworkUrl100?.replace('100x100', '600x600'),
    preview_url: match.previewUrl,
    duration: Math.floor(match.trackTimeMillis / 1000),
    itunesId: match.trackId,
  };
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const filePath = './itunes_tracks.json';
const existing = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
const existingKeys = new Set(existing.map((item) => `${normalize(item.title)}|||${normalize(item.artist)}`));

for (const target of targets) {
  try {
    console.log(`Searching: ${target.query}`);
    const result = await searchItunes(target);
    if (!result) {
      console.log(`No exact match: ${target.title}`);
    } else {
      const key = `${normalize(result.title)}|||${normalize(result.artist)}`;
      if (existingKeys.has(key)) {
        console.log(`Already exists: ${result.title}`);
      } else {
        existing.push(result);
        existingKeys.add(key);
        console.log(`Added: ${result.title} — ${result.artist}`);
      }
    }
  } catch (error) {
    console.log(`Failed: ${target.title} (${error.message})`);
  }

  await delay(1200);
}

fs.writeFileSync(filePath, JSON.stringify(existing, null, 2));
console.log(`Saved ${existing.length} tracks to ${filePath}`);
