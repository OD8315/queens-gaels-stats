import React, { useState, useEffect, useRef } from 'react';
import { 
  Trophy, Calendar, Users, Activity, Play, Pause, RefreshCw, 
  ChevronRight, Shield, Flame, Search, Filter, Info, Bell, MapPin, Clock, ArrowRight
} from 'lucide-react';

// --- TRICOLOUR BRAND CONSTANTS ---
// Navy Blue: #002147, Gold: #FEB81C, Red: #C8102E
const TRICOLOUR = {
  navy: '#002147',
  gold: '#FEB81C',
  red: '#C8102E',
  navyDark: '#001630',
  navyLight: '#0d3263',
  goldDark: '#d99900',
};

// --- INITIAL MOCK DATA ---
const INITIAL_SCHEDULE = [
  { id: 1, opponent: 'Western Mustangs', logo: '🐎', location: 'Richardson Stadium', type: 'Home', date: '2026-09-05', time: '13:00', status: 'FINAL', queensScore: 28, oppScore: 24, isW: true },
  { id: 2, opponent: 'Guelph Gryphons', logo: '🦅', location: 'Alumni Stadium (Guelph)', type: 'Away', date: '2026-09-12', time: '13:00', status: 'FINAL', queensScore: 35, oppScore: 14, isW: true },
  { id: 3, opponent: 'McMaster Marauders', logo: '⚔️', location: 'Richardson Stadium', type: 'Home', date: '2026-09-19', time: '13:00', status: 'LIVE', queensScore: 21, oppScore: 17, isW: false },
  { id: 4, opponent: 'Ottawa Gee-Gees', logo: '🐴', location: 'Gee-Gees Field', type: 'Away', date: '2026-09-26', time: '14:00', status: 'UPCOMING', queensScore: null, oppScore: null },
  { id: 5, opponent: 'Toronto Varsity Blues', logo: '🛡️', location: 'Richardson Stadium', type: 'Home', date: '2026-10-03', time: '13:00', status: 'UPCOMING', queensScore: null, oppScore: null },
  { id: 6, opponent: 'Carleton Ravens', logo: '🐦', location: 'MNP Park', type: 'Away', date: '2026-10-10', time: '13:00', status: 'UPCOMING', queensScore: null, oppScore: null },
  { id: 7, opponent: 'Laurier Golden Hawks', logo: '🦅', location: 'Richardson Stadium', type: 'Home', date: '2026-10-17', time: '13:00', status: 'UPCOMING', queensScore: null, oppScore: null },
  { id: 8, opponent: 'OUA Quarterfinals', logo: '🏆', location: 'TBD', type: 'Playoffs', date: '2026-10-24', time: '13:00', status: 'UPCOMING', queensScore: null, oppScore: null },
];

const ROSTER_DATA = [
  { id: 101, number: '7', name: 'Alex Vreeken', pos: 'QB', yr: 'Sr.', ht: '6\'2"', wt: '215', hometown: 'Kingston, ON', passingYds: 1845, passingTD: 14, rushingYds: 120, int: 4, img: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?auto=format&fit=crop&q=80&w=200' },
  { id: 102, number: '21', name: 'Jared Chisari', pos: 'RB', yr: '5th', ht: '5\'11"', wt: '205', hometown: 'Napanee, ON', rushingYds: 942, rushingTD: 11, recYds: 140, avgYpc: 6.4, img: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=200' },
  { id: 103, number: '81', name: 'Richard Burton', pos: 'WR', yr: 'Sr.', ht: '6\'0"', wt: '190', hometown: 'Ottawa, ON', recYds: 680, recTD: 7, receptions: 42, avgYpr: 16.2, img: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=200' },
  { id: 104, number: '88', name: 'Niko Kalinic', pos: 'WR', yr: 'Jr.', ht: '6\'3"', wt: '210', hometown: 'Toronto, ON', recYds: 410, recTD: 4, receptions: 28, avgYpr: 14.6, img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200' },
  { id: 105, number: '54', name: 'Silas Hubert', pos: 'DL', yr: 'Sr.', ht: '6\'4"', wt: '255', hometown: 'Hastings, ON', tackles: 38.5, sacks: 7.5, tfl: 11.0, ff: 2, img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200' },
  { id: 106, number: '4', name: 'Ashton Miller-Melancon', pos: 'DB', yr: 'Jr.', ht: '6\'1"', wt: '195', hometown: 'Montreal, QC', tackles: 29.0, int: 5, passDef: 8, ff: 1, img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200' },
  { id: 107, number: '33', name: 'Stephane Tshishimbi', pos: 'LB', yr: 'So.', ht: '6\'0"', wt: '220', hometown: 'Quebec City, QC', tackles: 46.0, sacks: 2.0, tfl: 5.5, ff: 1, img: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=200' },
  { id: 108, number: '12', name: 'Tyler Mullan', pos: 'K/P', yr: 'So.', ht: '5\'10"', wt: '175', hometown: 'North Bay, ON', fgMade: 14, fgAtt: 16, longFg: 48, puntAvg: 42.3, img: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200' }
];

const INITIAL_PLAYS = [
  { id: 1, quarter: 3, time: '04:12', type: 'Pass', text: '#7 A. Vreeken pass complete to #81 R. Burton for 18 yards to the MAC 32 (1st Down).', yards: 18, team: 'QUEEN\'S' },
  { id: 2, quarter: 3, time: '03:45', type: 'Rush', text: '#21 J. Chisari rush middle for 6 yards to the MAC 26.', yards: 6, team: 'QUEEN\'S' },
  { id: 3, quarter: 3, time: '03:10', type: 'Rush', text: '#21 J. Chisari rush left end for 12 yards to the MAC 14 (1st Down).', yards: 12, team: 'QUEEN\'S' },
  { id: 4, quarter: 3, time: '02:30', type: 'Pass', text: '#7 A. Vreeken pass incomplete deep right targeted for #88 N. Kalinic.', yards: 0, team: 'QUEEN\'S' },
  { id: 5, quarter: 3, time: '02:15', type: 'Touchdown', text: 'TOUCHDOWN QUEEN\'S! #7 A. Vreeken 14 yard pass to #81 R. Burton! PAT GOOD by #12 T. Mullan.', yards: 14, team: 'QUEEN\'S', scoreChange: { queens: 7, opp: 0 } },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('live'); // 'live' | 'schedule' | 'roster' | 'stats'
  
  // Game Live State
  const [isSimulating, setIsSimulating] = useState(false);
  const [quarter, setQuarter] = useState(3);
  const [clockSeconds, setClockSeconds] = useState(135); // 2:15 remaining in Q3
  const [down, setDown] = useState(2);
  const [distance, setDistance] = useState(10);
  const [ballPosition, setBallPosition] = useState(65); // 0 = Queen's Goal Line, 100 = Opponent Goal Line (MAC 35)
  const [possession, setPossession] = useState('QUEEN\'S'); // 'QUEEN\'S' or 'OPP'
  
  const [score, setScore] = useState({
    queens: 21,
    opp: 17,
    q1: { queens: 7, opp: 3 },
    q2: { queens: 7, opp: 7 },
    q3: { queens: 7, opp: 7 },
    q4: { queens: 0, opp: 0 }
  });

  const [plays, setPlays] = useState(INITIAL_PLAYS);
  const [toastMessage, setToastMessage] = useState(null);

  // Filters
  const [scheduleFilter, setScheduleFilter] = useState('ALL');
  const [rosterSearch, setRosterSearch] = useState('');
  const [posFilter, setPosFilter] = useState('ALL');

  // Trigger Toast Notification
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Live Game Clock Engine
  useEffect(() => {
    let timer;
    if (isSimulating && clockSeconds > 0) {
      timer = setInterval(() => {
        setClockSeconds(prev => prev - 1);
      }, 1000);
    } else if (clockSeconds === 0 && isSimulating) {
      if (quarter < 4) {
        setQuarter(q => q + 1);
        setClockSeconds(900); // 15:00
        triggerToast(`End of Quarter ${quarter}. Moving to Quarter ${quarter + 1}`);
      } else {
        setIsSimulating(false);
        triggerToast("FINAL GAME OVER! Queen's Gaels Victory!");
      }
    }
    return () => clearInterval(timer);
  }, [isSimulating, clockSeconds, quarter]);

  // Simulated Stat/Play-by-Play Generator Loop
  useEffect(() => {
    let playInterval;
    if (isSimulating) {
      playInterval = setInterval(() => {
        generateMockPlay();
      }, 7000); // New simulated play every 7 seconds
    }
    return () => clearInterval(playInterval);
  }, [isSimulating, down, distance, ballPosition, possession, score, quarter, clockSeconds]);

  // Generates dynamic Canadian Football style live play
  const generateMockPlay = () => {
    const playTypes = ['Pass', 'Rush', 'Incomplete', 'Sack', 'Touchdown', 'FieldGoal'];
    const selectedType = playTypes[Math.floor(Math.random() * playTypes.length)];
    const qb = 'Alex Vreeken';
    const rb = 'Jared Chisari';
    const wrs = ['Richard Burton', 'Niko Kalinic'];
    const wr = wrs[Math.floor(Math.random() * wrs.length)];

    let playYards = 0;
    let newDown = down;
    let newDist = distance;
    let newPos = ballPosition;
    let playText = '';
    let currentClock = formatClock(clockSeconds);

    if (selectedType === 'Pass') {
      playYards = Math.floor(Math.random() * 18) + 4;
      playText = `#7 ${qb} pass complete to #${wr} for ${playYards} yards.`;
    } else if (selectedType === 'Rush') {
      playYards = Math.floor(Math.random() * 12) + 1;
      playText = `#21 ${rb} rush up the middle for ${playYards} yards.`;
    } else if (selectedType === 'Incomplete') {
      playYards = 0;
      playText = `#7 ${qb} pass incomplete intended for #${wr}.`;
    } else if (selectedType === 'Sack') {
      playYards = -Math.floor(Math.random() * 7) - 2;
      playText = `#7 ${qb} sacked by McMaster defense for loss of ${Math.abs(playYards)} yards.`;
    } else if (selectedType === 'Touchdown') {
      playYards = 100 - ballPosition;
      playText = `TOUCHDOWN QUEEN'S! #7 ${qb} long pass to #${wr} in the endzone for ${playYards} yards! PAT GOOD.`;
      setScore(prev => ({
        ...prev,
        queens: prev.queens + 7,
        [`q${quarter}`]: { ...prev[`q${quarter}`], queens: prev[`q${quarter}`].queens + 7 }
      }));
      triggerToast('TOUCHDOWN QUEEN\'S GAELS! +7 PTS!');
      newPos = 35; // Reset position after kickoff
      newDown = 1;
      newDist = 10;
    } else if (selectedType === 'FieldGoal') {
      playText = `FIELD GOAL GOOD! #12 Tyler Mullan drills a 42-yard field goal!`;
      setScore(prev => ({
        ...prev,
        queens: prev.queens + 3,
        [`q${quarter}`]: { ...prev[`q${quarter}`], queens: prev[`q${quarter}`].queens + 3 }
      }));
      triggerToast('FIELD GOAL QUEEN\'S! +3 PTS!');
      newPos = 35;
      newDown = 1;
      newDist = 10;
    }

    if (selectedType !== 'Touchdown' && selectedType !== 'FieldGoal') {
      newPos = Math.min(99, Math.max(1, ballPosition + playYards));
      if (playYards >= distance) {
        newDown = 1;
        newDist = 10;
        playText += ' (1st Down!)';
      } else {
        newDown = down === 3 ? 1 : down + 1; // 3 downs in Canadian Football
        newDist = Math.max(1, distance - playYards);
        if (down === 3 && playYards < distance) {
          playText += ' (Turnover on Downs)';
          setPossession(possession === 'QUEEN\'S' ? 'MCMASTER' : 'QUEEN\'S');
          newDown = 1;
          newDist = 10;
        }
      }
    }

    setDown(newDown);
    setDistance(newDist);
    setBallPosition(newPos);

    const newPlay = {
      id: Date.now(),
      quarter,
      time: currentClock,
      type: selectedType,
      text: playText,
      yards: playYards,
      team: possession
    };

    setPlays(prev => [newPlay, ...prev]);
  };

  const formatClock = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none max-w-md mx-auto shadow-2xl relative border-x border-slate-800">
      
      {/* --- HEADER BAR --- */}
      <header className="sticky top-0 z-40 bg-gradient-to-r from-[#002147] via-[#001630] to-[#002147] border-b border-amber-500/30 px-4 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-[#FEB81C] text-[#002147] font-black flex items-center justify-center text-xl border-2 border-[#C8102E] shadow-md">
            Q
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
              QUEEN'S GAELS
              <span className="bg-[#C8102E] text-white text-[10px] uppercase font-bold px-1.5 py-0.5 rounded tracking-wider">
                OUA
              </span>
            </h1>
            <p className="text-xs text-amber-400/90 font-medium">Live Stats & Game Tracker</p>
          </div>
        </div>

        {/* Live Simulation Engine Toggle */}
        <button
          onClick={() => setIsSimulating(!isSimulating)}
          className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shadow-md ${
            isSimulating 
              ? 'bg-red-600 text-white animate-pulse shadow-red-900/50' 
              : 'bg-amber-400 text-slate-950 hover:bg-amber-300'
          }`}
        >
          {isSimulating ? (
            <>
              <Pause className="w-3.5 h-3.5" /> LIVE SIM
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" /> START SIM
            </>
          )}
        </button>
      </header>

      {/* --- NOTIFICATION TOAST --- */}
      {toastMessage && (
        <div className="absolute top-16 left-4 right-4 z-50 bg-[#C8102E] text-white px-4 py-3 rounded-xl shadow-2xl border-2 border-amber-400 flex items-center justify-between animate-bounce">
          <div className="flex items-center gap-2 font-bold text-sm">
            <Flame className="w-5 h-5 text-amber-300 fill-amber-300" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* --- MAIN CONTENT CONTAINER --- */}
      <main className="flex-1 overflow-y-auto pb-20">
        {activeTab === 'live' && (
          <LiveGameView 
            score={score}
            quarter={quarter}
            clockSeconds={clockSeconds}
            formatClock={formatClock}
            down={down}
            distance={distance}
            ballPosition={ballPosition}
            possession={possession}
            plays={plays}
            isSimulating={isSimulating}
          />
        )}

        {activeTab === 'schedule' && (
          <ScheduleView 
            schedule={INITIAL_SCHEDULE}
            filter={scheduleFilter}
            setFilter={setScheduleFilter}
          />
        )}

        {activeTab === 'roster' && (
          <RosterView 
            roster={ROSTER_DATA}
            search={rosterSearch}
            setSearch={setRosterSearch}
            posFilter={posFilter}
            setPosFilter={setPosFilter}
          />
        )}
      </main>

      {/* --- MOBILE NAVIGATION BOTTOM BAR --- */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#002147]/95 backdrop-blur-md border-t border-slate-800 z-40 px-4 py-2 flex justify-around items-center">
        <button
          onClick={() => setActiveTab('live')}
          className={`flex flex-col items-center gap-1 text-xs font-semibold px-3 py-1 rounded-lg transition ${
            activeTab === 'live' ? 'text-amber-400 bg-slate-900/80 border border-amber-500/20' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="w-5 h-5" />
          <span>Live Game</span>
        </button>

        <button
          onClick={() => setActiveTab('schedule')}
          className={`flex flex-col items-center gap-1 text-xs font-semibold px-3 py-1 rounded-lg transition ${
            activeTab === 'schedule' ? 'text-amber-400 bg-slate-900/80 border border-amber-500/20' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span>Schedule</span>
        </button>

        <button
          onClick={() => setActiveTab('roster')}
          className={`flex flex-col items-center gap-1 text-xs font-semibold px-3 py-1 rounded-lg transition ${
            activeTab === 'roster' ? 'text-amber-400 bg-slate-900/80 border border-amber-500/20' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-5 h-5" />
          <span>Roster & Stats</span>
        </button>
      </nav>
    </div>
  );
}

// ==========================================
// 1. LIVE GAME & DASHBOARD COMPONENT
// ==========================================
function LiveGameView({ score, quarter, clockSeconds, formatClock, down, distance, ballPosition, possession, plays, isSimulating }) {
  const getYardlineText = (pos) => {
    if (pos === 50) return '50 Yard Line';
    if (pos < 50) return `QUEEN'S ${pos}`;
    return `MCMASTER ${100 - pos}`;
  };

  return (
    <div className="p-4 space-y-4">
      
      {/* SCOREBOARD CARD */}
      <div className="bg-gradient-to-b from-[#002147] to-[#00142c] rounded-2xl p-4 border border-amber-500/30 shadow-xl relative overflow-hidden">
        {/* Glow background accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>

        {/* Live Status Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isSimulating ? 'bg-red-500 animate-ping' : 'bg-slate-500'}`}></span>
            <span className="font-bold tracking-wider text-slate-300">
              {isSimulating ? `Q${quarter} • ${formatClock(clockSeconds)}` : 'PAUSED / LIVE FEED'}
            </span>
          </div>
          <span className="text-amber-400 font-semibold flex items-center gap-1">
            <MapPin className="w-3 h-3" /> Richardson Stadium
          </span>
        </div>

        {/* Team Scores Display */}
        <div className="grid grid-cols-3 items-center py-4 text-center">
          {/* Queen's */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-[#002147] border-2 border-[#FEB81C] flex items-center justify-center font-black text-2xl text-[#FEB81C] shadow-lg mb-1">
              Q
            </div>
            <span className="font-extrabold text-sm tracking-wide text-white">QUEEN'S</span>
            <span className="text-3xl font-black text-amber-400 mt-1">{score.queens}</span>
          </div>

          {/* Quarter & Time Breakdown */}
          <div className="flex flex-col items-center justify-center px-2">
            <div className="text-xs text-slate-400 font-semibold uppercase mb-1">Down & Distance</div>
            <div className="bg-slate-900/90 text-amber-300 font-black text-sm px-3 py-1.5 rounded-lg border border-amber-500/30 shadow-inner">
              {down === 1 ? '1st' : down === 2 ? '2nd' : '3rd'} & {distance}
            </div>
            <div className="text-[11px] text-slate-400 mt-2 font-medium">
              At {getYardlineText(ballPosition)}
            </div>
          </div>

          {/* Opponent */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center font-black text-xl text-slate-300 shadow-lg mb-1">
              MAC
            </div>
            <span className="font-extrabold text-sm tracking-wide text-slate-300">MCMASTER</span>
            <span className="text-3xl font-black text-slate-200 mt-1">{score.opp}</span>
          </div>
        </div>

        {/* Line Score Table */}
        <div className="bg-slate-900/70 rounded-xl p-2 mt-1 border border-slate-800">
          <div className="grid grid-cols-6 text-center text-[10px] font-bold text-slate-400 pb-1 border-b border-slate-800">
            <span className="text-left pl-2">TEAM</span>
            <span>Q1</span>
            <span>Q2</span>
            <span>Q3</span>
            <span>Q4</span>
            <span className="text-amber-400">TOT</span>
          </div>
          <div className="grid grid-cols-6 text-center text-xs font-semibold py-1 border-b border-slate-800/50">
            <span className="text-left pl-2 font-bold text-amber-400">QUEEN'S</span>
            <span>{score.q1.queens}</span>
            <span>{score.q2.queens}</span>
            <span>{score.q3.queens}</span>
            <span>{score.q4.queens}</span>
            <span className="font-extrabold text-amber-400">{score.queens}</span>
          </div>
          <div className="grid grid-cols-6 text-center text-xs font-semibold py-1">
            <span className="text-left pl-2 font-bold text-slate-400">MAC</span>
            <span>{score.q1.opp}</span>
            <span>{score.q2.opp}</span>
            <span>{score.q3.opp}</span>
            <span>{score.q4.opp}</span>
            <span className="font-extrabold text-slate-300">{score.opp}</span>
          </div>
        </div>
      </div>

      {/* --- FIELD VISUALIZER GRAPHIC --- */}
      <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 shadow-lg">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-amber-400" /> Live Field Position
          </h2>
          <span className="text-xs bg-amber-400/10 text-amber-300 px-2 py-0.5 rounded font-medium border border-amber-400/20">
            Possession: {possession}
          </span>
        </div>

        {/* 2D Football Field Canvas */}
        <div className="relative w-full h-28 bg-emerald-800 rounded-xl border-2 border-emerald-600/60 overflow-hidden shadow-inner flex flex-col justify-between p-2">
          {/* Endzones */}
          <div className="absolute top-0 bottom-0 left-0 w-8 bg-[#002147] border-r-2 border-white/80 flex items-center justify-center">
            <span className="rotate-90 text-[10px] font-black tracking-widest text-[#FEB81C]">QUEEN'S</span>
          </div>
          <div className="absolute top-0 bottom-0 right-0 w-8 bg-[#C8102E] border-l-2 border-white/80 flex items-center justify-center">
            <span className="-rotate-90 text-[10px] font-black tracking-widest text-white">MAC</span>
          </div>

          {/* Yardlines */}
          <div className="absolute inset-y-0 left-8 right-8 flex justify-between items-center pointer-events-none opacity-40">
            {[20, 30, 40, 50, 40, 30, 20].map((num, i) => (
              <div key={i} className="h-full border-r border-dashed border-white/70 flex items-center justify-center">
                <span className="text-[9px] font-bold text-white/80">{num}</span>
              </div>
            ))}
          </div>

          {/* Ball Marker Indicator */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 transition-all duration-700 ease-out z-20 flex flex-col items-center"
            style={{ left: `calc(${ballPosition}% * 0.82 + 8%)` }}
          >
            <div className="w-4 h-4 bg-amber-400 rounded-full border-2 border-slate-950 shadow-lg flex items-center justify-center animate-bounce">
              <div className="w-1.5 h-1.5 bg-slate-950 rounded-full"></div>
            </div>
            <div className="bg-slate-950/90 text-amber-300 text-[9px] px-1.5 py-0.5 rounded font-black border border-amber-400/50 mt-1 whitespace-nowrap shadow-md">
              {ballPosition} YD
            </div>
          </div>
        </div>

        {/* Drive Info */}
        <div className="mt-3 flex justify-between items-center text-xs text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
          <div>Drive: <span className="text-white font-bold">6 Plays, 48 Yards</span></div>
          <div>TOP: <span className="text-white font-bold">2:45</span></div>
        </div>
      </div>

      {/* --- PLAY BY PLAY FEED --- */}
      <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-400" /> Play-By-Play Live Feed
          </h2>
          <span className="text-[11px] text-slate-500">{plays.length} Plays Logged</span>
        </div>

        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {plays.map((play) => (
            <div 
              key={play.id}
              className={`p-3 rounded-xl border text-xs transition-all ${
                play.type === 'Touchdown' 
                  ? 'bg-[#C8102E]/20 border-red-500/50 text-red-200' 
                  : play.type === 'FieldGoal'
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-200'
                  : 'bg-slate-950 border-slate-800/80 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1 text-[10px] font-semibold text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="bg-slate-800 text-amber-300 px-1.5 py-0.5 rounded">Q{play.quarter} {play.time}</span>
                  <span className="font-bold text-slate-300">{play.team}</span>
                </div>
                <span className={`px-1.5 py-0.5 rounded font-bold uppercase ${
                  play.yards > 0 ? 'text-emerald-400 bg-emerald-950/60' : 'text-slate-400 bg-slate-800'
                }`}>
                  {play.type} {play.yards > 0 ? `+${play.yards} YDS` : ''}
                </span>
              </div>
              <p className="font-medium text-slate-200 leading-relaxed">{play.text}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

// ==========================================
// 2. SCHEDULE & RESULTS COMPONENT
// ==========================================
function ScheduleView({ schedule, filter, setFilter }) {
  const filteredSchedule = schedule.filter(item => {
    if (filter === 'HOME') return item.type === 'Home';
    if (filter === 'AWAY') return item.type === 'Away';
    if (filter === 'PLAYOFFS') return item.type === 'Playoffs';
    return true;
  });

  return (
    <div className="p-4 space-y-4">
      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {['ALL', 'HOME', 'AWAY', 'PLAYOFFS'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              filter === f 
                ? 'bg-[#FEB81C] text-[#002147] shadow-md' 
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            {f} MATCHES
          </button>
        ))}
      </div>

      {/* Match Cards */}
      <div className="space-y-3">
        {filteredSchedule.map((game) => (
          <div 
            key={game.id}
            className="bg-slate-900 rounded-2xl p-4 border border-slate-800 shadow-md relative overflow-hidden"
          >
            {/* Status Header */}
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2 pb-2 border-b border-slate-800">
              <span>{game.date} • {game.time}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider ${
                game.status === 'LIVE' ? 'bg-red-600 text-white animate-pulse' :
                game.status === 'FINAL' ? 'bg-slate-800 text-slate-300' : 'bg-amber-500/20 text-amber-300'
              }`}>
                {game.status}
              </span>
            </div>

            {/* Teams Matchup */}
            <div className="flex justify-between items-center py-2">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{game.logo}</div>
                <div>
                  <h3 className="font-extrabold text-sm text-white">{game.opponent}</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-amber-400" /> {game.location}
                  </p>
                </div>
              </div>

              {/* Score Display or Kickoff */}
              {game.status === 'FINAL' || game.status === 'LIVE' ? (
                <div className="text-right">
                  <div className="text-lg font-black text-amber-400">
                    {game.queensScore} - {game.oppScore}
                  </div>
                  <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                    game.isW ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'
                  }`}>
                    {game.isW ? 'WIN' : 'LOSS'}
                  </span>
                </div>
              ) : (
                <div className="text-right">
                  <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20">
                    {game.type}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 3. ROSTER & PLAYER STATS COMPONENT
// ==========================================
function RosterView({ roster, search, setSearch, posFilter, setPosFilter }) {
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const filteredRoster = roster.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(search.toLowerCase()) || 
                          player.number.includes(search);
    const matchesPos = posFilter === 'ALL' || player.pos === posFilter;
    return matchesSearch && matchesPos;
  });

  return (
    <div className="p-4 space-y-4">
      {/* Search & Position Filters */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text"
            placeholder="Search player name or number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {['ALL', 'QB', 'RB', 'WR', 'DL', 'LB', 'DB', 'K/P'].map((pos) => (
            <button
              key={pos}
              onClick={() => setPosFilter(pos)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                posFilter === pos 
                  ? 'bg-amber-400 text-slate-950' 
                  : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
            >
              {pos}
            </button>
          ))}
        </div>
      </div>

      {/* Roster Grid Cards */}
      <div className="grid grid-cols-1 gap-3">
        {filteredRoster.map((player) => (
          <div 
            key={player.id}
            onClick={() => setSelectedPlayer(player)}
            className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-3 flex items-center justify-between cursor-pointer transition shadow-md"
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-slate-800 overflow-hidden border border-slate-700 flex-shrink-0">
                <img src={player.img} alt={player.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 font-black text-sm">#{player.number}</span>
                  <h3 className="font-extrabold text-sm text-white">{player.name}</h3>
                </div>
                <p className="text-xs text-slate-400">{player.pos} • {player.yr} • {player.hometown}</p>
              </div>
            </div>

            <ChevronRight className="w-5 h-5 text-slate-500" />
          </div>
        ))}
      </div>

      {/* PLAYER MODAL POPUP */}
      {selectedPlayer && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl p-5 max-w-sm w-full shadow-2xl relative animate-in fade-in zoom-in">
            <button 
              onClick={() => setSelectedPlayer(null)}
              className="absolute top-4 right-4 bg-slate-800 text-slate-400 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm"
            >
              ✕
            </button>

            <div className="flex items-center space-x-4 mb-4">
              <img src={selectedPlayer.img} alt={selectedPlayer.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400 shadow-md" />
              <div>
                <span className="text-xs font-black text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                  #{selectedPlayer.number} • {selectedPlayer.pos}
                </span>
                <h2 className="text-lg font-black text-white mt-1">{selectedPlayer.name}</h2>
                <p className="text-xs text-slate-400">{selectedPlayer.hometown} | {selectedPlayer.ht}, {selectedPlayer.wt} lbs</p>
              </div>
            </div>

            {/* Season Stats Breakdown */}
            <div className="bg-slate-950 rounded-xl p-3 border border-slate-800">
              <h4 className="text-xs font-extrabold uppercase text-amber-400 mb-2">2026 Season Statistics</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {selectedPlayer.passingYds && (
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Passing Yards</span>
                    <span className="font-black text-white text-base">{selectedPlayer.passingYds}</span>
                  </div>
                )}
                {selectedPlayer.passingTD && (
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Passing Touchdowns</span>
                    <span className="font-black text-emerald-400 text-base">{selectedPlayer.passingTD}</span>
                  </div>
                )}
                {selectedPlayer.rushingYds && (
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Rushing Yards</span>
                    <span className="font-black text-white text-base">{selectedPlayer.rushingYds}</span>
                  </div>
                )}
                {selectedPlayer.recYds && (
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Receiving Yards</span>
                    <span className="font-black text-white text-base">{selectedPlayer.recYds}</span>
                  </div>
                )}
                {selectedPlayer.tackles && (
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Total Tackles</span>
                    <span className="font-black text-white text-base">{selectedPlayer.tackles}</span>
                  </div>
                )}
                {selectedPlayer.sacks && (
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Sacks</span>
                    <span className="font-black text-amber-400 text-base">{selectedPlayer.sacks}</span>
                  </div>
                )}
              </div>
            </div>

            <button 
              onClick={() => setSelectedPlayer(null)}
              className="mt-4 w-full bg-[#FEB81C] text-[#002147] font-extrabold text-xs py-2.5 rounded-xl shadow-lg hover:bg-amber-300 transition"
            >
              Close Player Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
