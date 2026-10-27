import React, { useState, useEffect } from 'react';

// Live feeds mapped to match dates & host institutions
const OUA_GAMES = {
  '2026-11-07': {
    title: "OUA Semifinal",
    opponent: "TBD",
    // Automatically switches feed based on host venue
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

  // Connection & Feed Health State
  const [isLive, setIsLive] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const activeGame = OUA_GAMES['2026-11-07'];
    if (!activeGame?.liveFeedUrl) return;

    const pollLiveStats = async () => {
      try {
        // Route through Vercel API proxy to handle CORS
        const proxyUrl = `/api/stats?targetUrl=${encodeURIComponent(activeGame.liveFeedUrl)}`;
        const res = await fetch(proxyUrl);

        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

        const data = await res.json();

        // Validate payload structure
        if (data && data.stats) {
          setGameState({
            homeScore: data.stats.home?.score || 0,
            awayScore: data.stats.visitor?.score || 0,
            quarter: data.stats.status?.period || '1st',
            clock: data.stats.status?.clock || '15:00',
            downAndDistance: data.stats.ball?.downDistance || '',
            recentPlay: data.stats.lastPlay || ''
          });

          // Mark connection as healthy
          setIsLive(true);
          setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        } else {
          // Feed returned data but invalid format (e.g., pre-game empty state)
          setIsLive(false);
        }
      } catch (err) {
        console.warn("Live stat feed inactive or unreachable:", err.message);
        setIsLive(false);
      }
    };

    // Run immediately on load, then poll every 15 seconds
    pollLiveStats();
    const interval = setInterval(pollLiveStats, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 bg-gray-900 text-white min-h-screen">
      {/* Header with Connection Indicator Badge */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-4">
        <div>
          <h1 className="text-xl font-bold text-amber-400">Queen's Gaels Football</h1>
          <p className="text-xs text-gray-400">OUA Semifinal • Nov 7th</p>
        </div>

        {/* Live vs Offline Status Badge */}
        <div className="flex flex-col items-end">
          <div
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase transition-colors duration-300 ${
              isLive
                ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                : 'bg-rose-950/80 text-rose-400 border border-rose-500/30'
            }`}
          >
            <span className="relative flex h-2 w-2">
              {isLive && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              )}
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  isLive ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
              ></span>
            </span>
            {isLive ? 'Live Feed' : 'Offline'}
          </div>

          {lastUpdated && isLive && (
            <span className="text-[10px] text-gray-400 mt-1">
              Updated {lastUpdated}
            </span>
          )}
        </div>
      </div>

      {/* Main Scorecard View */}
      <div className="p-4 bg-gray-800 rounded-xl border border-gray-700/50 shadow-lg">
        <div className="text-3xl font-extrabold tracking-tight">
          QUE {gameState.homeScore} - {gameState.awayScore} OPP
        </div>
        <div className="text-sm font-medium text-gray-400 mt-1">
          {gameState.quarter} Quarter • {gameState.clock}
        </div>
        <div className="text-md font-semibold mt-3 text-amber-300">
          {gameState.downAndDistance}
        </div>
        <div className="mt-3 bg-gray-900/60 p-3 rounded-lg border border-gray-700/40">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Last Play</span>
          <p className="text-xs text-gray-200 leading-relaxed">
            {gameState.recentPlay}
          </p>
        </div>
      </div>
    </div>
  );
}
