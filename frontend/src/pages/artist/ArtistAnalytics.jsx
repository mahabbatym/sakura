import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, AreaChart, Area } from 'recharts';

const dayData = [
  { day: 'Mon', plays: 120, followers: 10 },
  { day: 'Tue', plays: 180, followers: 16 },
  { day: 'Wed', plays: 155, followers: 13 },
  { day: 'Thu', plays: 220, followers: 22 },
  { day: 'Fri', plays: 260, followers: 31 },
];

const topTracks = [
  { name: 'Track A', plays: 240 },
  { name: 'Track B', plays: 180 },
  { name: 'Track C', plays: 140 },
];

const ArtistAnalytics = () => (
  <main className="main-content">
    <h2 className="section-title">Artist Analytics</h2>
    <div className="pricing-grid">
      <div className="card">
        <h4>Plays by day</h4>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={dayData}><XAxis dataKey="day" /><YAxis /><Tooltip /><Line type="monotone" dataKey="plays" stroke="#ff6b9d" /></LineChart>
        </ResponsiveContainer>
      </div>
      <div className="card">
        <h4>Top tracks</h4>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={topTracks}><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="plays" fill="#ffd700" /></BarChart>
        </ResponsiveContainer>
      </div>
      <div className="card">
        <h4>Follower growth</h4>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={dayData}><XAxis dataKey="day" /><YAxis /><Tooltip /><Area type="monotone" dataKey="followers" stroke="#ff6b9d" fill="#ff6b9d66" /></AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  </main>
);

export default ArtistAnalytics;
