import axios from 'axios';
import fs from 'fs';

const songs = [
  "Aikyn Tolepbergen  Асылым",
  "Darkhan Juzz En suly",
  "Молданазар Махабатым",
  "Отпетые Мошенники Люби меня люби",
  "Anna Of The North Lovers",
  "Arctic Monkeys I Wanna Be Yours",
  "Bad Bunny DtMF",
  "bakr Сирен",
  "Billie Eilish WILDFLOWER",
  "charlie puth attention",
  "charlie puth selena gomez we dont talk anymore",
  "Darkhan Juzz Shyraq",
  "dj snake justin bieber let me love you",
  "Dominic Fike Babydoll",
  "Ed Sheeran Perfect",
  "ed sheeran shape of you",
  "eminem rihanna love the way you lie",
  "french montana swae lee unforgettable remix",
  "glass animals iann dior heat waves",
  "Kodak Heart Mind",
  "huntrix golden",
  "JID 21 Savage Surround Sound",
  "justin bieber love yourself",
  "justin bieber sorry",
  "kendrick lamar sza all the stars",
  "lauv i like me better",
  "Lil Pump Gucci Gang",
  "M'Dee Нужна",
  "napa deslocado evrovidenie 2025 portugalija",
  "pitbull kesha timber",
  "post malone swae lee sunflower",
  "serebro Между нами любовь",
  "shawn mendes camila cabello señorita",
  "Starlight TAEIL",
  "Stephen Sanchez Until I Found You",
  "sting shape of my heart",
  "the chainsmokers halsey closer",
  "VXVPRINCE Asylum",
  "Xcho Про любовь",
  "mot Баллада",
  "yung kai blue",
  "Sabrina Carpenter Espresso",
  "Sabrina Carpenter Please Please Please",
  "Benson Boone Beautiful Things",
  "Teddy Swims Lose Control",
  "Hozier Too Sweet",
  "Djo End of Beginning",
  "Dua Lipa Houdini",
  "Ariana Grande we cant be friends",
  "Taylor Swift Post Malone Fortnight",
  "Billie Eilish BIRDS OF A FEATHER",
  "Chappell Roan Good Luck Babe",
  "Tommy Richman MILLION DOLLAR BABY",
  "Shaboozey A Bar Song",
  "Noah Kahan Stick Season",
  "SZA Saturn",
  "Doja Cat Agora Hills",
  "Post Malone Morgan Wallen I Had Some Help",
  "Eminem Houdini",
  "Artemas i like the way you kiss me",
  "The Weeknd Timeless",
  "Dimash Kudaibergen S.O.S",
  "Dimash Kudaibergen Golden",
  "RaiM Дискотека из 90",
  "RaiM Howla",
  "RaiM Almatynyn Tunderi-ai",
  "Moldanazar Akpen Birge",
  "Moldanazar Senin Zhanynda",
  "Ninety One Ah Yah Mah",
  "Ninety One Bari Biled",
  "Ninety One Men Emes",
  "Jah Khalib Лейла",
  "Jah Khalib Медина",
  "Kairat Nurtas Suydim Seni",
  "Kairat Nurtas Aray",
  "Toregali Toreali Tuugan Kun",
  "Miras Zhugunusov Zhalynda",
  "Ayau Bapi Sen emes",
  "Irina Kairatovna 5000",
  "Dequine Makhabbat",
  "Alem Turaly",
  "The Weeknd Blinding Lights",
  "The Neighbourhood Sweater Weather",
  "The Weeknd Daft Punk Starboy",
  "Harry Styles As It Was",
  "Lewis Capaldi Someone You Loved",
  "Drake Wizkid Kyla One Dance",
  "The Kid LAROI Justin Bieber STAY",
  "Imagine Dragons Believer",
  "Billie Eilish Khalid lovely",
  "Coldplay Yellow",
  "Lord Huron The Night We Met",
  "Vance Joy Riptide",
  "Lady Gaga Bruno Mars Die With A Smile",
  "Alex Warren Ordinary",
  "sombr back to friends"
];

async function searchItunes(query) {
  try {
    const response = await axios.get('https://itunes.apple.com/search', {
      params: {
        term: query,
        media: 'music',
        limit: 1,
        entity: 'song',
      },
    });
    if (response.data.results.length === 0) return null;
    const item = response.data.results[0];
    return {
      title: item.trackName,
      artist: item.artistName,
      album: item.collectionName,
      cover: item.artworkUrl100?.replace('100x100', '600x600'),
      preview_url: item.previewUrl,
      duration: Math.floor(item.trackTimeMillis / 1000),
      itunesId: item.trackId,
    };
  } catch (err) {
    console.error(`Error searching for ${query}:`, err.message);
    return null;
  }
}

(async () => {
  const results = [];
  for (const song of songs) {
    console.log(`Іздеу: ${song}`);
    const data = await searchItunes(song);
    if (data) {
      results.push(data);
    } else {
      console.log(`Табылмады: ${song}`);
    }
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  fs.writeFileSync('itunes_tracks.json', JSON.stringify(results, null, 2));
  console.log('Нәтижелер itunes_tracks.json файлына сақталды');
})();
