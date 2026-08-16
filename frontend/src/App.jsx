import React, { useState, useEffect } from 'react';

// Local storage key constants
const STORAGE_KEY_ROLLOVERS = 'mxrollover_local_rollovers';
const STORAGE_KEY_STEPS = 'mxrollover_local_steps';
const STORAGE_KEY_ADMIN_PASS = 'mxrollover_admin_password';
const STORAGE_KEY_TEAM_ANALYSIS = 'mxrollover_team_analysis_logs';
const STORAGE_KEY_LEAGUE_DATA = 'mxrollover_custom_league_teams_data';

// Initial Comprehensive League & Team Database based on user specs
const INITIAL_LEAGUE_TEAMS = {
  "La Liga": [
    { rank: 1, name: "Alavés", mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, cornersAvg: 4.8, goalsScoredAvg: 1.2, goalsConcededAvg: 1.1, recentForm: ["W", "D", "L", "W", "W"] },
    { rank: 2, name: "Sevilla", mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, cornersAvg: 5.2, goalsScoredAvg: 1.4, goalsConcededAvg: 1.0, recentForm: ["W", "W", "D", "L", "W"] },
    { rank: 3, name: "Deportivo", mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, cornersAvg: 4.5, goalsScoredAvg: 1.0, goalsConcededAvg: 1.2, recentForm: ["L", "D", "W", "L", "D"] },
    { rank: 4, name: "Racing Santander", mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, cornersAvg: 4.2, goalsScoredAvg: 1.1, goalsConcededAvg: 1.3, recentForm: ["D", "W", "L", "W", "L"] },
    { rank: 5, name: "Real Madrid", mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, cornersAvg: 6.5, goalsScoredAvg: 2.4, goalsConcededAvg: 0.7, recentForm: ["W", "W", "W", "D", "W"] },
    { rank: 6, name: "Celta", mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, cornersAvg: 4.9, goalsScoredAvg: 1.3, goalsConcededAvg: 1.3, recentForm: ["D", "L", "W", "W", "L"] },
    { rank: 7, name: "Barcelona", mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, cornersAvg: 6.8, goalsScoredAvg: 2.6, goalsConcededAvg: 0.8, recentForm: ["W", "W", "D", "W", "W"] },
    { rank: 8, name: "Málaga", mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, cornersAvg: 4.4, goalsScoredAvg: 1.0, goalsConcededAvg: 1.2, recentForm: ["L", "L", "D", "W", "L"] },
    { rank: 9, name: "Real Sociedad", mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, cornersAvg: 5.3, goalsScoredAvg: 1.5, goalsConcededAvg: 1.1, recentForm: ["W", "D", "W", "L", "W"] },
    { rank: 10, name: "Osasuna", mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, cornersAvg: 4.6, goalsScoredAvg: 1.1, goalsConcededAvg: 1.2, recentForm: ["D", "L", "D", "W", "L"] },
    { rank: 11, name: "Villarreal", mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, cornersAvg: 5.4, goalsScoredAvg: 1.6, goalsConcededAvg: 1.2, recentForm: ["W", "W", "L", "D", "W"] },
    { rank: 12, name: "Atlético Madrid", mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, cornersAvg: 5.0, goalsScoredAvg: 1.7, goalsConcededAvg: 0.8, recentForm: ["W", "D", "W", "W", "L"] },
    { rank: 13, name: "Levante", mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, cornersAvg: 4.3, goalsScoredAvg: 1.0, goalsConcededAvg: 1.4, recentForm: ["L", "D", "L", "W", "D"] },
    { rank: 14, name: "Elche", mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, cornersAvg: 4.1, goalsScoredAvg: 0.9, goalsConcededAvg: 1.5, recentForm: ["L", "L", "W", "D", "L"] },
    { rank: 15, name: "Espanyol", mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, cornersAvg: 4.7, goalsScoredAvg: 1.2, goalsConcededAvg: 1.3, recentForm: ["D", "W", "L", "L", "W"] },
    { rank: 16, name: "Valencia", mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, cornersAvg: 4.8, goalsScoredAvg: 1.3, goalsConcededAvg: 1.2, recentForm: ["W", "L", "D", "W", "D"] },
    { rank: 17, name: "Betis", mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, cornersAvg: 5.1, goalsScoredAvg: 1.4, goalsConcededAvg: 1.2, recentForm: ["D", "W", "W", "L", "D"] },
    { rank: 18, name: "Athletic", mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, cornersAvg: 5.5, goalsScoredAvg: 1.4, goalsConcededAvg: 1.0, recentForm: ["W", "D", "W", "W", "L"] },
    { rank: 19, name: "Rayo Vallecano", mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, cornersAvg: 4.8, goalsScoredAvg: 1.1, goalsConcededAvg: 1.4, recentForm: ["L", "W", "D", "L", "W"] },
    { rank: 20, name: "Getafe", mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, cornersAvg: 3.9, goalsScoredAvg: 0.8, goalsConcededAvg: 1.2, recentForm: ["D", "L", "L", "W", "D"] }
  ],
  "EPL": [
    { rank: 1, name: "Bournemouth", mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, cornersAvg: 4.9, goalsScoredAvg: 1.3, goalsConcededAvg: 1.4, recentForm: ["W", "D", "L", "W", "D"] },
    { rank: 2, name: "Arsenal", mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, cornersAvg: 6.9, goalsScoredAvg: 2.2, goalsConcededAvg: 0.7, recentForm: ["W", "W", "W", "D", "W"] },
    { rank: 3, name: "Aston Villa", mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, cornersAvg: 5.6, goalsScoredAvg: 1.8, goalsConcededAvg: 1.1, recentForm: ["W", "L", "W", "W", "D"] },
    { rank: 4, name: "Brentford", mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, cornersAvg: 4.8, goalsScoredAvg: 1.5, goalsConcededAvg: 1.3, recentForm: ["D", "W", "L", "W", "L"] },
    { rank: 5, name: "Brighton", mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, cornersAvg: 5.8, goalsScoredAvg: 1.6, goalsConcededAvg: 1.3, recentForm: ["W", "D", "W", "D", "W"] },
    { rank: 6, name: "Chelsea", mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, cornersAvg: 6.0, goalsScoredAvg: 1.9, goalsConcededAvg: 1.1, recentForm: ["W", "W", "L", "W", "D"] },
    { rank: 7, name: "Coventry", mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, cornersAvg: 4.5, goalsScoredAvg: 1.2, goalsConcededAvg: 1.3, recentForm: ["L", "D", "W", "L", "W"] },
    { rank: 8, name: "Palace", mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, cornersAvg: 4.7, goalsScoredAvg: 1.3, goalsConcededAvg: 1.2, recentForm: ["D", "W", "D", "L", "W"] },
    { rank: 9, name: "Everton", mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, cornersAvg: 5.0, goalsScoredAvg: 1.1, goalsConcededAvg: 1.2, recentForm: ["L", "D", "W", "D", "L"] },
    { rank: 10, name: "Fulham", mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, cornersAvg: 5.1, goalsScoredAvg: 1.3, goalsConcededAvg: 1.3, recentForm: ["W", "L", "D", "W", "D"] },
    { rank: 11, name: "Hull", mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, cornersAvg: 4.2, goalsScoredAvg: 1.1, goalsConcededAvg: 1.4, recentForm: ["D", "L", "L", "W", "D"] },
    { rank: 12, name: "Ipswich Town", mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, cornersAvg: 4.0, goalsScoredAvg: 1.0, goalsConcededAvg: 1.6, recentForm: ["L", "L", "D", "L", "W"] },
    { rank: 13, name: "Leeds", mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, cornersAvg: 5.3, goalsScoredAvg: 1.4, goalsConcededAvg: 1.3, recentForm: ["W", "D", "L", "W", "D"] },
    { rank: 14, name: "Liverpool", mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, cornersAvg: 7.2, goalsScoredAvg: 2.3, goalsConcededAvg: 0.9, recentForm: ["W", "W", "W", "D", "W"] },
    { rank: 15, name: "Man City", mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, cornersAvg: 7.5, goalsScoredAvg: 2.5, goalsConcededAvg: 0.8, recentForm: ["W", "W", "W", "W", "D"] },
    { rank: 16, name: "Man United", mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, cornersAvg: 5.9, goalsScoredAvg: 1.6, goalsConcededAvg: 1.2, recentForm: ["W", "L", "W", "D", "W"] },
    { rank: 17, name: "Newcastle", mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, cornersAvg: 5.8, goalsScoredAvg: 1.7, goalsConcededAvg: 1.1, recentForm: ["W", "D", "W", "W", "L"] },
    { rank: 18, name: "Nottm Forest", mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, cornersAvg: 4.6, goalsScoredAvg: 1.2, goalsConcededAvg: 1.4, recentForm: ["L", "W", "D", "L", "D"] },
    { rank: 19, name: "Sunderland", mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, cornersAvg: 4.3, goalsScoredAvg: 1.0, goalsConcededAvg: 1.5, recentForm: ["D", "L", "W", "L", "L"] },
    { rank: 20, name: "Spurs", mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, cornersAvg: 6.2, goalsScoredAvg: 1.8, goalsConcededAvg: 1.3, recentForm: ["W", "W", "L", "D", "W"] }
  ],
  "Bundesliga": [
    { rank: 1, name: "Köln", mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, cornersAvg: 4.8, goalsScoredAvg: 1.3, goalsConcededAvg: 1.3, recentForm: ["D", "W", "L", "W", "D"] },
    { rank: 2, name: "Leverkusen", mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, cornersAvg: 6.4, goalsScoredAvg: 2.3, goalsConcededAvg: 0.9, recentForm: ["W", "W", "W", "D", "W"] },
    { rank: 3, name: "Bayern", mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, cornersAvg: 7.1, goalsScoredAvg: 2.8, goalsConcededAvg: 0.8, recentForm: ["W", "W", "W", "W", "W"] },
    { rank: 4, name: "Dortmund", mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, cornersAvg: 6.2, goalsScoredAvg: 2.1, goalsConcededAvg: 1.1, recentForm: ["W", "L", "W", "W", "D"] },
    { rank: 5, name: "Mönchengladbach", mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, cornersAvg: 5.0, goalsScoredAvg: 1.4, goalsConcededAvg: 1.4, recentForm: ["D", "W", "D", "L", "W"] },
    { rank: 6, name: "Eintracht Frankfurt", mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, cornersAvg: 5.3, goalsScoredAvg: 1.6, goalsConcededAvg: 1.2, recentForm: ["W", "D", "W", "W", "L"] },
    { rank: 7, name: "Augsburg", mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, cornersAvg: 4.6, goalsScoredAvg: 1.2, goalsConcededAvg: 1.4, recentForm: ["L", "D", "W", "L", "D"] },
    { rank: 8, name: "Mainz", mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, cornersAvg: 4.7, goalsScoredAvg: 1.2, goalsConcededAvg: 1.3, recentForm: ["D", "W", "L", "D", "W"] },
    { rank: 9, name: "Hamburg", mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, cornersAvg: 4.8, goalsScoredAvg: 1.3, goalsConcededAvg: 1.3, recentForm: ["W", "L", "D", "W", "L"] },
    { rank: 10, name: "RB Leipzig", mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, cornersAvg: 5.9, goalsScoredAvg: 1.9, goalsConcededAvg: 1.0, recentForm: ["W", "W", "D", "L", "W"] },
    { rank: 11, name: "Freiburg", mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, cornersAvg: 5.1, goalsScoredAvg: 1.3, goalsConcededAvg: 1.2, recentForm: ["D", "W", "L", "W", "D"] },
    { rank: 12, name: "Paderborn", mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, cornersAvg: 4.2, goalsScoredAvg: 1.1, goalsConcededAvg: 1.6, recentForm: ["L", "L", "D", "W", "L"] },
    { rank: 13, name: "Schalke", mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, cornersAvg: 4.5, goalsScoredAvg: 1.1, goalsConcededAvg: 1.4, recentForm: ["D", "W", "L", "L", "D"] },
    { rank: 14, name: "SV Elversberg", mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, cornersAvg: 4.1, goalsScoredAvg: 1.0, goalsConcededAvg: 1.5, recentForm: ["L", "D", "L", "W", "L"] },
    { rank: 15, name: "Hoffenheim", mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, cornersAvg: 5.2, goalsScoredAvg: 1.5, goalsConcededAvg: 1.5, recentForm: ["W", "L", "D", "W", "D"] },
    { rank: 16, name: "Union Berlin", mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, cornersAvg: 4.4, goalsScoredAvg: 1.1, goalsConcededAvg: 1.2, recentForm: ["D", "W", "D", "L", "W"] },
    { rank: 17, name: "VfB Stuttgart", mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, cornersAvg: 5.6, goalsScoredAvg: 1.7, goalsConcededAvg: 1.3, recentForm: ["W", "W", "L", "D", "W"] },
    { rank: 18, name: "Werder", mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, cornersAvg: 4.6, goalsScoredAvg: 1.2, goalsConcededAvg: 1.5, recentForm: ["L", "D", "W", "L", "D"] }
  ]
};

// SVG Isometric Pie Chart Component (Based on Image 1 reference)
function IsometricSvgPieChart() {
  return (
    <div style={{ textAlign: 'center', padding: '10px' }}>
      <svg width="180" height="180" viewBox="0 0 200 200" style={{ filter: 'drop-shadow(0px 8px 12px rgba(0,0,0,0.25))' }}>
        {/* Drop Shadow Base Ellipse */}
        <ellipse cx="100" cy="165" rx="75" ry="20" fill="rgba(0,0,0,0.15)" />
        
        {/* Slice 1: Blue (Top) */}
        <path d="M 100 100 L 100 30 A 70 70 0 0 1 167.5 56.5 Z" fill="#2563eb" stroke="#1d4ed8" strokeWidth="1" />
        <path d="M 100 100 L 167.5 56.5 L 167.5 70 A 70 40 0 0 1 100 114 Z" fill="#1d4ed8" opacity="0.8" />

        {/* Slice 2: Yellow (Right Top) */}
        <path d="M 100 100 L 167.5 56.5 A 70 70 0 0 1 140 159 Z" fill="#eab308" stroke="#ca8a04" strokeWidth="1" />
        <path d="M 100 100 L 140 159 L 140 172 A 70 40 0 0 1 167.5 70 Z" fill="#ca8a04" opacity="0.8" />

        {/* Slice 3: Orange (Bottom Right) */}
        <path d="M 100 100 L 140 159 A 70 70 0 0 1 100 170 Z" fill="#f97316" stroke="#c2410c" strokeWidth="1" />
        <path d="M 100 100 L 100 170 L 100 183 A 70 40 0 0 1 140 172 Z" fill="#c2410c" opacity="0.8" />

        {/* Slice 4: Red (Bottom Left) */}
        <path d="M 100 100 L 100 170 A 70 70 0 0 1 30 120 Z" fill="#ef4444" stroke="#dc2626" strokeWidth="1" />
        <path d="M 100 100 L 30 120 L 30 133 A 70 40 0 0 1 100 183 Z" fill="#dc2626" opacity="0.8" />

        {/* Slice 5: Green (Top Left) */}
        <path d="M 100 100 L 30 120 A 70 70 0 0 1 100 30 Z" fill="#10b981" stroke="#059669" strokeWidth="1" />
        <path d="M 100 100 L 100 30 L 100 43 A 70 40 0 0 1 30 133 Z" fill="#059669" opacity="0.8" />
      </svg>
      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '6px', fontWeight: 'bold' }}>League Goal & Corner Statistics Share</div>
    </div>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Customization & Settings States
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showSettingsAccordion, setShowSettingsAccordion] = useState(false);
  const [username, setUsername] = useState(() => localStorage.getItem('userProfileUsername') || 'Savings User');
  const [theme, setTheme] = useState(() => localStorage.getItem('userProfileTheme') || 'default');
  const [profilePic, setProfilePic] = useState(() => localStorage.getItem('userProfileImage') || null);
  
  const [bgImage, setBgImage] = useState(() => {
    const active = localStorage.getItem('useCustomBgActive') === 'true';
    return active ? localStorage.getItem('userProfileCustomBg') : null;
  });

  // Admin Panel States
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  
  const [showChangePassSection, setShowChangePassSection] = useState(false);
  const [oldPassInput, setOldPassInput] = useState('');
  const [newPassInput, setNewPassInput] = useState('');
  const [confirmPassInput, setConfirmPassInput] = useState('');

  const [openCreateBetslip, setOpenCreateBetslip] = useState(true);
  const [openLiveScore, setOpenLiveScore] = useState(false);
  const [expandedRunId, setExpandedRunId] = useState(null);

  // Coupon Builder Form States
  const [baseStake, setBaseStake] = useState('1000');
  const [kickOffTime, setKickOffTime] = useState('');
  const [stagedMatches, setStagedMatches] = useState([]);
  const [accumulatedOdds, setAccumulatedOdds] = useState(1.00);
  const [matchIdInput, setMatchIdInput] = useState('');
  const [prediction, setPrediction] = useState('Over 1.5');
  
  // Individual Accumulator Selection Builders
  const [homeTeam, setHomeTeam] = useState('Barcelona');
  const [awayTeam, setAwayTeam] = useState('Alavés');
  const [matchOdd, setMatchOdd] = useState('1.55');

  // Rollover / Bets list
  const [rolloverRuns, setRolloverRuns] = useState([]);
  const [loading, setLoading] = useState(true);

  // League Tables & H2H Tab States
  const [selectedLeague, setSelectedLeague] = useState('La Liga');
  const [leagueSubView, setLeagueSubView] = useState('table');
  const [h2hTeamA, setH2hTeamA] = useState('Barcelona');
  const [h2hTeamB, setH2hTeamB] = useState('Alavés');
  
  const [selectedTeamDetail, setSelectedTeamDetail] = useState(null);

  // League & Team Database State
  const [leagueTeamsData, setLeagueTeamsData] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_LEAGUE_DATA);
    return saved ? JSON.parse(saved) : INITIAL_LEAGUE_TEAMS;
  });

  // Admin Fixture / Match & Team Editor Dropdown States (Strictly Dropdowns 0-9 goals, 0-30 corners, 2 games per season max)
  const [adminEditLeague, setAdminEditLeague] = useState('La Liga');
  const [adminEditTeamName, setAdminEditTeamName] = useState('Barcelona');
  
  // Dropdown Match Details states
  const [fixtureHomeTeam, setFixtureHomeTeam] = useState('Barcelona');
  const [fixtureAwayTeam, setFixtureAwayTeam] = useState('Alavés');
  const [homeGoals, setHomeGoals] = useState('2');
  const [awayGoals, setAwayGoals] = useState('1');
  const [homeCorners, setHomeCorners] = useState('6');
  const [awayCorners, setAwayCorners] = useState('4');
  const [seasonGameLeg, setSeasonGameLeg] = useState('1'); // Leg 1 or Leg 2 (Two games per season rule)

  const [adminEditCorners, setAdminEditCorners] = useState('6.8');
  const [adminEditGoalsScored, setAdminEditGoalsScored] = useState('2.6');
  const [adminEditGoalsConceded, setAdminEditGoalsConceded] = useState('0.8');
  const [adminEditForm, setAdminEditForm] = useState('W,W,D,W,W');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    try {
      const rawRollovers = localStorage.getItem(STORAGE_KEY_ROLLOVERS);
      const rawSteps = localStorage.getItem(STORAGE_KEY_STEPS);
      
      const rollovers = rawRollovers ? JSON.parse(rawRollovers) : [];
      const steps = rawSteps ? JSON.parse(rawSteps) : [];

      const runs = [...rollovers].reverse().map(run => {
        const runSteps = steps
          .filter(step => String(step.rollover_id) === String(run.id))
          .sort((a, b) => a.day_number - b.day_number);
        return { ...run, steps: runSteps };
      });

      setRolloverRuns(runs);
      setLoading(false);
    } catch (err) {
      console.error("Local storage load error.", err);
      setLoading(false);
    }
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    const storedPass = localStorage.getItem(STORAGE_KEY_ADMIN_PASS) || '1234';
    if (adminPasswordInput === storedPass) {
      setIsAdminLoggedIn(true);
      setAdminPasswordInput('');
    } else {
      alert("Incorrect Admin Password! (Default is 1234)");
    }
  };

  const handleChangeAdminPassword = (e) => {
    e.preventDefault();
    const currentStoredPass = localStorage.getItem(STORAGE_KEY_ADMIN_PASS) || '1234';
    if (oldPassInput !== currentStoredPass) {
      alert("Old password is incorrect!");
      return;
    }
    localStorage.setItem(STORAGE_KEY_ADMIN_PASS, newPassInput);
    alert("Admin password successfully updated!");
    setOldPassInput('');
    setNewPassInput('');
    setConfirmPassInput('');
    setShowChangePassSection(false);
  };

  // Handle Admin Saving Match & Team Details using Dropdowns only (2 games per season max)
  const handleAdminSaveFixtureAndTeam = (e) => {
    e.preventDefault();
    if (!isAdminLoggedIn) {
      alert("Admin authorization required!");
      return;
    }

    if (fixtureHomeTeam === fixtureAwayTeam) {
      alert("Home team and Away team cannot be identical!");
      return;
    }

    const updatedData = { ...leagueTeamsData };
    const leagueList = updatedData[adminEditLeague];
    if (!leagueList) return;

    // Update Home Team stats based on selected dropdown result & corners
    const homeIdx = leagueList.findIndex(t => t.name.toLowerCase() === fixtureHomeTeam.toLowerCase());
    const awayIdx = leagueList.findIndex(t => t.name.toLowerCase() === fixtureAwayTeam.toLowerCase());

    if (homeIdx !== -1 && awayIdx !== -1) {
      // Record match fixture for Leg (Game 1 or Game 2 of the season)
      const hgf = parseInt(homeGoals);
      const aga = parseInt(awayGoals);
      
      leagueList[homeIdx].mp += 1;
      leagueList[homeIdx].gf += hgf;
      leagueList[homeIdx].ga += aga;
      leagueList[homeIdx].gd = leagueList[homeIdx].gf - leagueList[homeIdx].ga;
      leagueList[homeIdx].cornersAvg = parseFloat(((leagueList[homeIdx].cornersAvg + parseInt(homeCorners)) / 2).toFixed(1));

      leagueList[awayIdx].mp += 1;
      leagueList[awayIdx].gf += aga;
      leagueList[awayIdx].ga += hgf;
      leagueList[awayIdx].gd = leagueList[awayIdx].gf - leagueList[awayIdx].ga;
      leagueList[awayIdx].cornersAvg = parseFloat(((leagueList[awayIdx].cornersAvg + parseInt(awayCorners)) / 2).toFixed(1));

      if (hgf > aga) {
        leagueList[homeIdx].w += 1;
        leagueList[homeIdx].pts += 3;
        leagueList[awayIdx].l += 1;
      } else if (hgf < aga) {
        leagueList[awayIdx].w += 1;
        leagueList[awayIdx].pts += 3;
        leagueList[homeIdx].l += 1;
      } else {
        leagueList[homeIdx].d += 1;
        leagueList[homeIdx].pts += 1;
        leagueList[awayIdx].d += 1;
        leagueList[awayIdx].pts += 1;
      }
    }

    setLeagueTeamsData(updatedData);
    localStorage.setItem(STORAGE_KEY_LEAGUE_DATA, JSON.stringify(updatedData));
    alert(`Successfully recorded Season Game Leg ${seasonGameLeg} for ${fixtureHomeTeam} vs ${fixtureAwayTeam} with dropdown stats!`);
  };

  const handleAppendMatch = (e) => {
    e.preventDefault();
    const currentOddsValue = parseFloat(matchOdd);
    const textSelection = `${homeTeam} vs ${awayTeam} (${prediction} @${currentOddsValue})`;
    
    setStagedMatches([...stagedMatches, textSelection]);
    setAccumulatedOdds(prev => prev * currentOddsValue);
  };

  const handleGenerateActiveSlip = (e) => {
    e.preventDefault();
    if (stagedMatches.length === 0) {
      alert("Please add at least one match to your coupon using the '+' button first.");
      return;
    }

    const d = new Date();
    const currentChallengeDate = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    const finalStake = parseFloat(baseStake) || 1000;

    try {
      const rawRollovers = localStorage.getItem(STORAGE_KEY_ROLLOVERS);
      const rawSteps = localStorage.getItem(STORAGE_KEY_STEPS);
      
      const rollovers = rawRollovers ? JSON.parse(rawRollovers) : [];
      const steps = rawSteps ? JSON.parse(rawSteps) : [];

      const newRolloverId = rollovers.length > 0 ? Math.max(...rollovers.map(r => r.id)) + 1 : 1;
      
      rollovers.push({
        id: newRolloverId,
        title: `${currentChallengeDate} Run`,
        target_goal: 10,
        initial_stake: finalStake,
        base_odds: parseFloat(accumulatedOdds.toFixed(2)),
        prediction: prediction
      });

      const winAmount = finalStake * parseFloat(accumulatedOdds.toFixed(2));
      const newStepId = steps.length > 0 ? Math.max(...steps.map(s => s.id)) + 1 : 1;

      steps.push({
        id: newStepId,
        rollover_id: newRolloverId,
        day_number: 1,
        stake: finalStake,
        odds: parseFloat(accumulatedOdds.toFixed(2)),
        win_amount: winAmount,
        status: 'pending'
      });

      localStorage.setItem(STORAGE_KEY_ROLLOVERS, JSON.stringify(rollovers));
      localStorage.setItem(STORAGE_KEY_STEPS, JSON.stringify(steps));
      
      setStagedMatches([]);
      setAccumulatedOdds(1.00);
      fetchData();
      setActiveTab('goal');
      alert(`Coupon initialized and added to Local Storage successfully!`);
    } catch (err) {
      alert("Failed to save the slip.");
    }
  };

  const handleDownloadBackupZip = () => {
    const backupData = {
      rollovers: localStorage.getItem(STORAGE_KEY_ROLLOVERS),
      steps: localStorage.getItem(STORAGE_KEY_STEPS),
      leagueData: localStorage.getItem(STORAGE_KEY_LEAGUE_DATA),
      settings: { username, theme },
      exportDate: new Date().toISOString()
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Vozinha255_League_Backup.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const currentLeagueTeamList = leagueTeamsData[selectedLeague] || [];

  return (
    <div className={`theme-container theme-${theme}`} style={{ backgroundImage: bgImage ? `url(${bgImage})` : 'none' }}>
      <div className="app-wrapper">
        
        {/* HEADER BLOCK */}
        <header onClick={(e) => e.stopPropagation()}>
          <div className="header-content">
            <div className="header-left">
              <h1>
                <i className="fa-solid fa-layer-group"></i> Vozinha255
              </h1>
              <p style={{ marginTop: '5px', color: '#3b82f6', fontSize: '0.9rem' }}>
                ✦ East Africa eFootball Management & Standings ✧
              </p>
            </div>
            
            <div className="header-right">
              <div className="profile-dropdown">
                <button className="profile-btn" onClick={(e) => { e.stopPropagation(); setShowProfileDropdown(!showProfileDropdown); }}>
                  <div id="profile-icon" style={{ backgroundImage: profilePic ? `url(${profilePic})` : 'none', backgroundSize: 'cover' }}>
                    {!profilePic && <i className="fas fa-user"></i>}
                  </div>
                </button>
                
                {showProfileDropdown && (
                  <div className="dropdown-content show" onClick={(e) => e.stopPropagation()}>
                    <div className="dropdown-header">
                      <div id="dropdown-profile-pic" style={{ backgroundImage: profilePic ? `url(${profilePic})` : 'none', backgroundSize: 'cover' }}>
                        {!profilePic && <i className="fas fa-user"></i>}
                      </div>
                      <div>
                        <strong>{username}</strong>
                        <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>League Manager</div>
                      </div>
                    </div>
                    
                    <div className="dropdown-divider"></div>
                    <a href="#dashboard" onClick={() => { setActiveTab('dashboard'); setShowProfileDropdown(false); }}><i className="fas fa-tachometer-alt"></i> Dashboard</a>
                    <a href="#tables" onClick={() => { setActiveTab('tables'); setShowProfileDropdown(false); }}><i className="fa-solid fa-table"></i> League Tables & H2H</a>
                    <a href="#goal" onClick={() => { setActiveTab('goal'); setShowProfileDropdown(false); }}><i className="fa-regular fa-circle-dot"></i> Active Bets</a>
                    <a href="#admin" onClick={(e) => { e.preventDefault(); setShowAdminModal(true); setShowProfileDropdown(false); }} style={{ color: '#e74c3c', fontWeight: 'bold' }}><i className="fa-solid fa-lock"></i> Admin Panel</a>
                    <a href="#backup" onClick={(e) => { e.preventDefault(); handleDownloadBackupZip(); setShowProfileDropdown(false); }} style={{ color: '#10b981', fontWeight: 'bold' }}><i className="fa-solid fa-download"></i> Download Backup</a>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <nav>
            <button className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}><i className="fas fa-home"></i> Home</button>
            <button className={`nav-btn ${activeTab === 'tables' ? 'active' : ''}`} onClick={() => setActiveTab('tables')}><i className="fa-solid fa-table"></i> Tables & H2H</button>
            <button className={`nav-btn ${activeTab === 'goal' ? 'active' : ''}`} onClick={() => setActiveTab('goal')}><i className="fa-regular fa-circle-dot"></i> Active Bets</button>
          </nav>
        </header>

        {/* ADMIN MODAL PANEL WITH DROPDOWNS ONLY & 2 GAMES PER SEASON RULE */}
        {showAdminModal && (
          <div className="admin-modal-overlay" onClick={() => setShowAdminModal(false)}>
            <div className="admin-modal-content" onClick={(e) => e.stopPropagation()} style={{ background: '#ffffff', padding: '20px', borderRadius: '10px', maxWidth: '580px', width: '90%', margin: '20px auto', maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
                <h3 style={{ margin: 0, color: '#1e293b' }}><i className="fa-solid fa-shield-halved"></i> Admin Control Center</h3>
                <button onClick={() => setShowAdminModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}><i className="fa-solid fa-xmark"></i></button>
              </div>

              {!isAdminLoggedIn ? (
                <form onSubmit={handleAdminLogin}>
                  <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Enter admin password to manage fixtures and team stats. (Default: 1234)</p>
                  <div className="input-group" style={{ margin: '15px 0' }}>
                    <label>Admin Password</label>
                    <input type="password" placeholder="Enter password (1234)" value={adminPasswordInput} onChange={(e) => setAdminPasswordInput(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} />
                  </div>
                  <button type="submit" style={{ width: '100%', backgroundColor: '#2563eb', color: 'white', padding: '10px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Login to Admin</button>
                </form>
              ) : (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f1f5f9', padding: '10px', borderRadius: '6px', marginBottom: '15px' }}>
                    <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 'bold' }}><i className="fa-solid fa-circle-check"></i> Admin Authenticated</span>
                    <button onClick={() => setIsAdminLoggedIn(false)} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>Logout</button>
                  </div>

                  {/* ADMIN FIXTURE & TEAM RESULTS RECORDER (Strictly Dropdowns 0-9 goals, 0-30 corners, 2 games per season) */}
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '15px', marginBottom: '15px' }}>
                    <h4 style={{ color: '#1e293b', marginTop: 0, marginBottom: '10px', fontSize: '0.95rem' }}>
                      <i className="fa-solid fa-futbol"></i> Record League Match & Fixture Results (Dropdowns Only)
                    </h4>
                    
                    <form onSubmit={handleAdminSaveFixtureAndTeam}>
                      <div style={{ marginBottom: '10px' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Select League</label>
                        <select value={adminEditLeague} onChange={(e) => setAdminEditLeague(e.target.value)} style={{ width: '100%', padding: '7px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                          <option value="La Liga">La Liga</option>
                          <option value="EPL">EPL</option>
                          <option value="Bundesliga">Bundesliga</option>
                        </select>
                      </div>

                      {/* TEAM NAME DROPDOWNS (IMAGE 2 STYLE) */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '8px', alignItems: 'center', marginBottom: '12px' }}>
                        <div>
                          <label style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Home Team</label>
                          <select value={fixtureHomeTeam} onChange={(e) => setFixtureHomeTeam(e.target.value)} style={{ width: '100%', padding: '7px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                            {leagueTeamsData[adminEditLeague].map(t => (
                              <option key={t.name} value={t.name}>{t.name}</option>
                            ))}
                          </select>
                        </div>
                        <div style={{ fontWeight: 'bold', color: '#ef4444', marginTop: '16px' }}>VS</div>
                        <div>
                          <label style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Away Team</label>
                          <select value={fixtureAwayTeam} onChange={(e) => setFixtureAwayTeam(e.target.value)} style={{ width: '100%', padding: '7px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                            {leagueTeamsData[adminEditLeague].map(t => (
                              <option key={t.name} value={t.name}>{t.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* SEASON GAME LEG SELECTION (2 games per season max rule) */}
                      <div style={{ marginBottom: '12px', background: '#e0f2fe', padding: '8px', borderRadius: '6px' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#0369a1' }}>Season Fixture Leg (Max 2 games per season per matchup)</label>
                        <select value={seasonGameLeg} onChange={(e) => setSeasonGameLeg(e.target.value)} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #7dd3fc', marginTop: '4px' }}>
                          <option value="1">Leg 1 (First Half of Season)</option>
                          <option value="2">Leg 2 (Return Match)</option>
                        </select>
                      </div>

                      {/* GOALS SCORED DROPDOWNS (0 to 9) */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                        <div>
                          <label style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Home Goals (0-9)</label>
                          <select value={homeGoals} onChange={(e) => setHomeGoals(e.target.value)} style={{ width: '100%', padding: '7px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                            {[...Array(10).keys()].map(n => <option key={n} value={n}>{n}</option>)}
                          </select>
                        </div>
                        <div>
                          <label style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Away Goals (0-9)</label>
                          <select value={awayGoals} onChange={(e) => setAwayGoals(e.target.value)} style={{ width: '100%', padding: '7px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                            {[...Array(10).keys()].map(n => <option key={n} value={n}>{n}</option>)}
                          </select>
                        </div>
                      </div>

                      {/* CORNERS DROPDOWNS (0 to 30) */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                        <div>
                          <label style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Home Corners (0-30)</label>
                          <select value={homeCorners} onChange={(e) => setHomeCorners(e.target.value)} style={{ width: '100%', padding: '7px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                            {[...Array(31).keys()].map(n => <option key={n} value={n}>{n}</option>)}
                          </select>
                        </div>
                        <div>
                          <label style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Away Corners (0-30)</label>
                          <select value={awayCorners} onChange={(e) => setAwayCorners(e.target.value)} style={{ width: '100%', padding: '7px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                            {[...Array(31).keys()].map(n => <option key={n} value={n}>{n}</option>)}
                          </select>
                        </div>
                      </div>

                      <button type="submit" style={{ background: '#2563eb', color: 'white', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem', width: '100%', fontWeight: 'bold' }}>
                        Save Match Results & Update Standings
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TEAM DETAIL MODAL WITH ISO SVG PIE CHART */}
        {selectedTeamDetail && (
          <div className="admin-modal-overlay" onClick={() => setSelectedTeamDetail(null)}>
            <div className="admin-modal-content" onClick={(e) => e.stopPropagation()} style={{ background: '#1e293b', color: '#fff', padding: '20px', borderRadius: '12px', maxWidth: '420px', width: '90%', margin: '40px auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', marginBottom: '15px' }}>
                <h3 style={{ margin: 0, color: '#38bdf8' }}><i className="fa-solid fa-shield-cat"></i> {selectedTeamDetail.name} Analytics</h3>
                <button onClick={() => setSelectedTeamDetail(null)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}><i className="fa-solid fa-xmark"></i></button>
              </div>

              {/* ISO SVG PIE CHART INTEGRATION */}
              <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '10px', marginBottom: '15px' }}>
                <IsometricSvgPieChart />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Goals Scored / Match</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#10b981', marginTop: '4px' }}>{selectedTeamDetail.goalsScoredAvg}</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Goals Conceded / Match</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#ef4444', marginTop: '4px' }}>{selectedTeamDetail.goalsConcededAvg}</div>
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Average Corners:</span>
                  <strong style={{ color: '#38bdf8' }}>{selectedTeamDetail.cornersAvg}</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MAIN BODY CONTENT */}
        <main className="content-container">
          
          {/* TAB 1: Dashboard View */}
          {activeTab === 'dashboard' && (
            <section className="page-view active" style={{ display: 'block' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ color: '#1e293b' }}>Vozinha255 Dashboard</h2>
              </div>

              <div className={`history-dropdown-card ${openCreateBetslip ? 'open' : ''}`}>
                <div className="history-header-toggle" onClick={() => setOpenCreateBetslip(!openCreateBetslip)} style={{ backgroundColor: '#f1f5f9' }}>
                  <p className="history-title-paragraph" style={{ fontWeight: 'bold' }}>
                    <i className="fa-solid fa-square-plus" style={{ color: '#3498db', marginRight: '6px' }}></i> Create Betslip Form
                  </p>
                  <i className="fas fa-chevron-down toggle-arrow"></i>
                </div>
                
                <div className="history-content-collapsible" style={{ display: openCreateBetslip ? 'block' : 'none', padding: '15px' }}>
                  <form onSubmit={handleGenerateActiveSlip}>
                    <div className="form-row-base">
                      <div className="input-group">
                        <label>Base Stake</label>
                        <input type="number" value={baseStake} onChange={(e) => setBaseStake(e.target.value)} required />
                      </div>
                      <div className="input-group">
                        <label>Total Odds</label>
                        <input type="number" value={accumulatedOdds.toFixed(2)} readOnly style={{ backgroundColor: '#f1f5f9', fontWeight: 'bold', color: '#2563eb' }} />
                      </div>
                    </div>

                    <div className="added-teams-summary">
                      {stagedMatches.length > 0 ? stagedMatches.join(' | ') : 'No matches staged yet.'}
                    </div>

                    {/* MATCH SELECTION DROPDOWNS (NO MANUAL TYPING) */}
                    <div className="accumulator-input-row" style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr auto', gap: '8px', alignItems: 'center', marginTop: '10px' }}>
                      <select value={homeTeam} onChange={(e) => setHomeTeam(e.target.value)} style={{ padding: '8px', borderRadius: '6px' }}>
                        {currentLeagueTeamList.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
                      </select>
                      <span className="vs-text">vs</span>
                      <select value={awayTeam} onChange={(e) => setAwayTeam(e.target.value)} style={{ padding: '8px', borderRadius: '6px' }}>
                        {currentLeagueTeamList.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
                      </select>
                      <button type="button" onClick={handleAppendMatch} className="append-plus-btn" style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer' }}>
                        <i className="fa-solid fa-plus"></i>
                      </button>
                    </div>

                    <button type="submit" className="create-slip-btn" style={{ marginTop: '15px' }}>Generate Active Slip</button>
                  </form>
                </div>
              </div>
            </section>
          )}

          {/* TAB 2: LEAGUE TABLES & H2H VIEW */}
          {activeTab === 'tables' && (
            <section className="page-view active" style={{ display: 'block' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
                <h2 style={{ color: '#1e293b', margin: 0 }}><i className="fa-solid fa-table"></i> Standings & H2H</h2>
                
                <div style={{ display: 'flex', gap: '8px' }}>
                  <select value={selectedLeague} onChange={(e) => setSelectedLeague(e.target.value)} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: 'bold' }}>
                    <option value="La Liga">🇪🇸 La Liga</option>
                    <option value="EPL">🇬🇧 Premier League</option>
                    <option value="Bundesliga">🇩🇪 Bundesliga</option>
                  </select>

                  <select value={leagueSubView} onChange={(e) => setLeagueSubView(e.target.value)} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: 'bold', background: '#2563eb', color: '#fff' }}>
                    <option value="table">Table View</option>
                    <option value="h2h">H2H Comparison</option>
                  </select>
                </div>
              </div>

              {leagueSubView === 'table' && (
                <div style={{ background: '#1e293b', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                  <div style={{ padding: '12px 15px', background: '#0f172a', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>{selectedLeague} Standings</span>
                  </div>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff', fontSize: '0.85rem', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8', fontSize: '0.75rem' }}>
                          <th style={{ padding: '10px' }}>Club</th>
                          <th style={{ padding: '10px', textAlign: 'center' }}>MP</th>
                          <th style={{ padding: '10px', textAlign: 'center' }}>W</th>
                          <th style={{ padding: '10px', textAlign: 'center' }}>D</th>
                          <th style={{ padding: '10px', textAlign: 'center' }}>L</th>
                          <th style={{ padding: '10px', textAlign: 'center' }}>Pts</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentLeagueTeamList.map((team) => (
                          <tr key={team.name} onClick={() => setSelectedTeamDetail(team)} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}>
                            <td style={{ padding: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ color: '#94a3b8', minWidth: '18px' }}>{team.rank}</span>
                              <strong style={{ color: '#f8fafc' }}>{team.name}</strong>
                            </td>
                            <td style={{ padding: '10px', textAlign: 'center' }}>{team.mp}</td>
                            <td style={{ padding: '10px', textAlign: 'center' }}>{team.w}</td>
                            <td style={{ padding: '10px', textAlign: 'center' }}>{team.d}</td>
                            <td style={{ padding: '10px', textAlign: 'center' }}>{team.l}</td>
                            <td style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold', color: '#38bdf8' }}>{team.pts}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {leagueSubView === 'h2h' && (
                <div style={{ background: '#fff', borderRadius: '10px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                  <h3 style={{ fontSize: '1rem', color: '#1e293b', marginBottom: '15px' }}>Head-to-Head Comparison</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#64748b' }}>Team A</label>
                      <select value={h2hTeamA} onChange={(e) => setH2hTeamA(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px' }}>
                        {currentLeagueTeamList.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#64748b' }}>Team B</label>
                      <select value={h2hTeamB} onChange={(e) => setH2hTeamB(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px' }}>
                        {currentLeagueTeamList.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
                      </select>
                    </div>
                  </div>

                  {(() => {
                    const teamAObj = currentLeagueTeamList.find(t => t.name === h2hTeamA) || currentLeagueTeamList[0];
                    const teamBObj = currentLeagueTeamList.find(t => t.name === h2hTeamB) || currentLeagueTeamList[1];
                    return (
                      <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                          <strong>{teamAObj.name}</strong>
                          <span style={{ color: '#ef4444', fontWeight: 'bold' }}>VS (2 Games / Season)</span>
                          <strong>{teamBObj.name}</strong>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#475569' }}>
                          <p>Corners Avg - {teamAObj.name}: {teamAObj.cornersAvg} | {teamBObj.name}: {teamBObj.cornersAvg}</p>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </section>
          )}

          {/* TAB 3: Active Bets */}
          {activeTab === 'goal' && (
            <section className="page-view active" style={{ display: 'block' }}>
              <h2 style={{ marginBottom: '15px', color: '#333' }}>Active Bets</h2>
              <div>
                {loading ? (
                  <p style={{ textAlign: 'center', color: '#64748b' }}>Loading...</p>
                ) : rolloverRuns.length === 0 ? (
                  <p style={{ color: '#64748b', textAlign: 'center', padding: '20px' }}>No active operations running.</p>
                ) : (
                  rolloverRuns.map((run) => (
                    <div className="history-dropdown-card" key={run.id} style={{ borderLeft: '4px solid #00b0ff', marginBottom: '15px', padding: '12px', background: '#fff' }}>
                      <strong>{run.title}</strong>
                      <p style={{ fontSize: '0.85rem', color: '#555' }}>Market: {run.prediction}</p>
                    </div>
                  ))
                )}
              </div>
            </section>
          )}

        </main>
      </div>
    </div>
  );
}

export default App;
