import { BrowserRouter } from 'react-router-dom';
import { useEffect, useState } from 'react';
import AppRouter from './routes/AppRouter';
import { MusicProvider, useMusic } from './context/MusicContext';
import Sidebar from './components/Sidebar';
import Player from './components/Player';
import BottomNav from './components/BottomNav';
import { ChevronUp, Music2 } from 'lucide-react';

const AppContent = () => {
  const { currentTrack } = useMusic();
  const [playerOpen, setPlayerOpen] = useState(false);

  useEffect(() => {
    if (currentTrack) {
      setPlayerOpen(true);
    }
  }, [currentTrack]);

  const openPlayer = () => setPlayerOpen(true);

  return (
    <BrowserRouter>
      <div className={`app-container ${!playerOpen ? 'player-closed' : ''}`}>
        <Sidebar />
        <main className="app-main-shell">
          <AppRouter />
        </main>
        <BottomNav />
        {playerOpen ? <Player onClose={() => setPlayerOpen(false)} /> : null}
        {!playerOpen && currentTrack ? (
          <button className="player-reopen" onClick={openPlayer} aria-label="Open player">
            <Music2 className="ui-icon" />
            <ChevronUp className="ui-icon" />
          </button>
        ) : null}
      </div>
    </BrowserRouter>
  );
};

function App() {
  return (
    <MusicProvider>
      <AppContent />
    </MusicProvider>
  );
}

export default App;
