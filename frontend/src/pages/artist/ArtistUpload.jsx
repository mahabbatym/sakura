import { useState } from 'react';

const ArtistUpload = () => {
  const [meta, setMeta] = useState({ title: '', genre: '', lyrics: '' });

  return (
    <main className="main-content">
      <h2 className="section-title">Track Upload</h2>
      <form className="payment-form">
        <input placeholder="Трек атауы" value={meta.title} onChange={(e) => setMeta((p) => ({ ...p, title: e.target.value }))} />
        <input placeholder="Жанр" value={meta.genre} onChange={(e) => setMeta((p) => ({ ...p, genre: e.target.value }))} />
        <input placeholder="Lyrics" value={meta.lyrics} onChange={(e) => setMeta((p) => ({ ...p, lyrics: e.target.value }))} />
        <input type="file" accept="audio/*" />
        <input type="file" accept="image/*" />
        <button type="button">Жүктеу</button>
      </form>
    </main>
  );
};

export default ArtistUpload;
