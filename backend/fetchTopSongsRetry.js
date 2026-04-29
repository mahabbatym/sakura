import axios from 'axios';
import fs from 'fs';

const targets = [
  { title: 'Sweater Weather', primaryArtist: 'The Neighbourhood', query: 'The Neighbourhood Sweater Weather' },
  { title: 'Starboy', primaryArtist: 'The Weeknd', query: 'The Weeknd Starboy Daft Punk' },
  { title: 'One Dance', primaryArtist: 'Drake', query: 'Drake One Dance Wizkid Kyla' },
  { title: 'STAY', primaryArtist: 'The Kid LAROI', query: 'The Kid LAROI STAY Justin Bieber' },
  { title: 'Believer', primaryArtist: 'Imagine Dragons', query: 'Imagine Dragons Believer' },
];

const normalize = (value) => String(value || '')
  .toLowerCase()
  .replace(/[’']/g, '')
  .replace(/[^a-z0-9а-яёқңғүұһәі\s]/gi, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const matchesTarget = (item, target) => {
  const title = normalize(item.trackName);
  const artist = normalize(item.artistName);
  const wantedTitle = normalize(target.title);
  const wantedArtist = normalize(target.primaryArtist);

  return (title === wantedTitle || title.startsWith(`${wantedTitle} `)) && artist.includes(wantedArtist);
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const filePath = './itunes_tracks.json';
const existing = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
const existingKeys = new Set(existing.map((item) => `${normalize(item.title)}|||${normalize(item.artist)}`));

for (const target of targets) {
  try {
    console.log(`Retrying: ${target.query}`);
    const response = await axios.get('https://itunes.apple.com/search', {
      params: {
        term: target.query,
        media: 'music',
        entity: 'song',
        limit: 10,
      },
      headers: {
        'User-Agent': 'SakuraTopSongsRetry/1.0',
        Accept: 'application/json',
      },
    });

    const match = response.data.results.find((item) => matchesTarget(item, target));
    if (!match) {
      console.log(`Still not found: ${target.title}`);
    } else {
      const next = {
        title: match.trackName,
        artist: match.artistName,
        album: match.collectionName,
        cover: match.artworkUrl100?.replace('100x100', '600x600'),
        preview_url: match.previewUrl,
        duration: Math.floor(match.trackTimeMillis / 1000),
        itunesId: match.trackId,
      };

      const key = `${normalize(next.title)}|||${normalize(next.artist)}`;
      if (existingKeys.has(key)) {
        console.log(`Already exists: ${next.title}`);
      } else {
        existing.push(next);
        existingKeys.add(key);
        console.log(`Added: ${next.title} — ${next.artist}`);
      }
    }
  } catch (error) {
    console.log(`Retry failed: ${target.title} (${error.message})`);
  }

  await delay(1800);
}

fs.writeFileSync(filePath, JSON.stringify(existing, null, 2));
console.log(`Saved ${existing.length} tracks to ${filePath}`);
