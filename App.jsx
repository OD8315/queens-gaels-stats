import React, { useState, useEffect } from 'react';

// Live feeds mapped to match dates & host institutions
const OUA_GAMES = {
  '2026-11-07': {
    title: "OUA Semifinal",
    opponent: "TBD",
    // Automatically switches feed based on host:
    liveFeedUrl: "https://gogaelsgo.com/sidearmstats/football/data.json" 
  }
};

export default function App() {
  const [gameState, setGameState] = useState({
    homeScore: 0,
    awayScore: 0,
    quarter: '1st',
    clock: '15:00',
    downAndDistance: '1st & 10 at QUE 35',
    recentPlay: 'Game starting soon...'
  });

  useEffect(() => {
    const activeGame = OUA_GAMES['2026-11-07'];
    if (!activeGame?.liveFeedUrl) return;

    const pollLiveStats = async () => {
      try {
        // Route through our Vercel API proxy to avoid CORS blocks
        const proxyUrl = `/api/stats?targetUrl=${encodeURIComponent(activeGame.liveFeedUrl)}`;
        const res = await fetch(proxyUrl);
        const data = await res.json();

        // Extract stats from standard PrestoSports / SIDEARM JSON structure
        if (data && data.stats) {
          setGameState({
            homeScore: data.stats.home?.score || 0,
            awayScore: data.stats.visitor?.score || 0,
            quarter: data.stats.status?.period || '1st',
            clock: data.stats.status?.clock || '15:00',
            downAndDistance: data.stats.ball?.downDistance || '',
            recentPlay: data.stats.lastPlay || ''
          });
        }
      } catch (err) {
        console.log("Live stat feed inactive or pre-game state.");
      }
    };

    // Poll every 15 seconds during game day
    pollLiveStats();
    const interval = setInterval(pollLiveStats, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 bg-gray-900 text-white min-h-screen">
      <h1 className="text-xl font-bold text-amber-400">Queen's Gaels Live Stats</h1>
      <div className="mt-4 p-4 bg-gray-800 rounded-lg">
        <div className="text-3xl font-extrabold">
          QUE {gameState.homeScore} - {gameState.awayScore} OPP
        </div>
        <div className="text-sm text-gray-400 mt-1">
          {gameState.quarter} | {gameState.clock}
        </div>
        <div className="text-md font-semibold mt-2 text-amber-300">
          {gameState.downAndDistance}
        </div>
        <p className="text-xs text-gray-300 mt-2 bg-gray-700 p-2 rounded">
          {gameState.recentPlay}
        </p>
      </div>
    </div>
  );
}
