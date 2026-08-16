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

function App() {
  // Navigation & Tab Switch State
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
  
  // Password Change States inside Admin Panel
  const [showChangePassSection, setShowChangePassSection] = useState(false);
  const [oldPassInput, setOldPassInput] = useState('');
  const [newPassInput, setNewPassInput] = useState('');
  const [confirmPassInput, setConfirmPassInput] = useState('');

  // Dashboard Accordion dropdown states
  const [openCreateBetslip, setOpenCreateBetslip] = useState(true);
  const [openLiveScore, setOpenLiveScore] = useState(false);

  // Accordion state to track which Active Bet slip card is expanded/clicked
  const [expandedRunId, setExpandedRunId] = useState(null);

  // Coupon Builder Form States
  const [baseStake, setBaseStake] = useState('1000');
  const [kickOffTime, setKickOffTime] = useState('');
  const [stagedMatches, setStagedMatches] = useState([]);
  const [accumulatedOdds, setAccumulatedOdds] = useState(1.00);
  const [matchIdInput, setMatchIdInput] = useState('');
  const [prediction, setPrediction] = useState('Over 1.5');
  
  // Individual Accumulator Selection Builders
  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');
  const [matchOdd, setMatchOdd] = useState('');

  // Active runs loaded from local storage
  const [rolloverRuns, setRolloverRuns] = useState([]);
  const [loading, setLoading] = useState(true);

  // League Tables & H2H Tab States
  const [selectedLeague, setSelectedLeague] = useState('La Liga');
  const [leagueSubView, setLeagueSubView] = useState('table'); // 'table' or 'h2h'
  const [h2hTeamA, setH2hTeamA] = useState('Barcelona');
  const [h2hTeamB, setH2hTeamB] = useState('Real Madrid');
  
  // Team Detail Modal State
  const [selectedTeamDetail, setSelectedTeamDetail] = useState(null);

  // League & Team Database State (Admin editable)
  const [leagueTeamsData, setLeagueTeamsData] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_LEAGUE_DATA);
    return saved ? JSON.parse(saved) : INITIAL_LEAGUE_TEAMS;
  });

  // Admin Team Editor Form States
  const [adminEditLeague, setAdminEditLeague] = useState('La Liga');
  const [adminEditTeamName, setAdminEditTeamName] = useState('Barcelona');
  const [adminEditCorners, setAdminEditCorners] = useState('6.8');
  const [adminEditGoalsScored, setAdminEditGoalsScored] = useState('2.6');
  const [adminEditGoalsConceded, setAdminEditGoalsConceded] = useState('0.8');
  const [adminEditForm, setAdminEditForm] = useState('W,W,D,W,W');

  // Load database entries on mount from Local Storage
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
      
      if (runs.length > 0) {
        const lastRun = runs[0];
        const wonSteps = lastRun.steps ? lastRun.steps.filter(s => s.status === 'win') : [];
        if (wonSteps.length > 0) {
          const lastWonPayout = Math.floor(wonSteps[wonSteps.length - 1].win_amount);
          setBaseStake(lastWonPayout.toString());
        }
      }
      setLoading(false);
    } catch (err) {
      console.error("Local storage load error.", err);
      setLoading(false);
    }
  };

  const handleUsernameChange = (e) => {
    const val = e.target.value;
    setUsername(val);
    localStorage.setItem('userProfileUsername', val);
  };

  const handleThemeChange = (e) => {
    const selectedTheme = e.target.value;
    setTheme(selectedTheme);
    setBgImage(null);
    localStorage.setItem('userProfileTheme', selectedTheme);
    localStorage.setItem('useCustomBgActive', 'false');
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
        localStorage.setItem('userProfileImage', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBgImage(reader.result);
        localStorage.setItem('userProfileCustomBg', reader.result);
        localStorage.setItem('useCustomBgActive', 'true');
      };
      reader.readAsDataURL(file);
    }
  };

  // Admin Login Verification
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
    if (!newPassInput || newPassInput.length < 3) {
      alert("New password must be at least 3 characters long.");
      return;
    }
    if (newPassInput !== confirmPassInput) {
      alert("New passwords do not match!");
      return;
    }

    localStorage.setItem(STORAGE_KEY_ADMIN_PASS, newPassInput);
    alert("Admin password successfully updated!");
    setOldPassInput('');
    setNewPassInput('');
    setConfirmPassInput('');
    setShowChangePassSection(false);
  };

  const handleDeleteRolloverRun = (runId) => {
    if (!window.confirm("Are you sure you want to delete this challenge run from database?")) return;
    try {
      const rawRollovers = localStorage.getItem(STORAGE_KEY_ROLLOVERS);
      const rawSteps = localStorage.getItem(STORAGE_KEY_STEPS);
      
      let rollovers = rawRollovers ? JSON.parse(rawRollovers) : [];
      let steps = rawSteps ? JSON.parse(rawSteps) : [];

      rollovers = rollovers.filter(r => r.id !== runId);
      steps = steps.filter(s => String(s.rollover_id) !== String(runId));

      localStorage.setItem(STORAGE_KEY_ROLLOVERS, JSON.stringify(rollovers));
      localStorage.setItem(STORAGE_KEY_STEPS, JSON.stringify(steps));
      fetchData();
      alert("Challenge run deleted successfully by Admin.");
    } catch (err) {
      alert("Failed to delete record.");
    }
  };

  // Handle Admin Saving Team Details (Corners, Results, Form, H2H metrics)
  const handleAdminSaveTeamDetails = (e) => {
    e.preventDefault();
    if (!isAdminLoggedIn) {
      alert("Admin authorization required!");
      return;
    }

    const updatedData = { ...leagueTeamsData };
    const leagueList = updatedData[adminEditLeague];
    if (!leagueList) return;

    const teamIndex = leagueList.findIndex(t => t.name.toLowerCase() === adminEditTeamName.toLowerCase());
    const formArray = adminEditForm.split(',').map(s => s.trim().toUpperCase());

    if (teamIndex !== -1) {
      leagueList[teamIndex] = {
        ...leagueList[teamIndex],
        cornersAvg: parseFloat(adminEditCorners) || leagueList[teamIndex].cornersAvg,
        goalsScoredAvg: parseFloat(adminEditGoalsScored) || leagueList[teamIndex].goalsScoredAvg,
        goalsConcededAvg: parseFloat(adminEditGoalsConceded) || leagueList[teamIndex].goalsConcededAvg,
        recentForm: formArray.length > 0 ? formArray : leagueList[teamIndex].recentForm
      };
    } else {
      // Add new team if not found
      leagueList.push({
        rank: leagueList.length + 1,
        name: adminEditTeamName,
        mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0,
        cornersAvg: parseFloat(adminEditCorners) || 5.0,
        goalsScoredAvg: parseFloat(adminEditGoalsScored) || 1.2,
        goalsConcededAvg: parseFloat(adminEditGoalsConceded) || 1.1,
        recentForm: formArray
      });
    }

    setLeagueTeamsData(updatedData);
    localStorage.setItem(STORAGE_KEY_LEAGUE_DATA, JSON.stringify(updatedData));
    alert(`Successfully updated statistics and details for ${adminEditTeamName} in ${adminEditLeague}!`);
  };

  const handleAppendMatch = (e) => {
    e.preventDefault();
    if (!homeTeam || !awayTeam || !prediction || isNaN(parseFloat(matchOdd))) {
      alert("Please fill all single row match properties (Home, Away, Bet, Odds) before adding.");
      return;
    }

    const currentOddsValue = parseFloat(matchOdd);
    const textSelection = `${homeTeam} vs ${awayTeam} (${prediction} @${currentOddsValue})`;
    
    setStagedMatches([...stagedMatches, textSelection]);
    setAccumulatedOdds(prev => prev * currentOddsValue);

    setHomeTeam('');
    setAwayTeam('');
    setMatchOdd('');
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
      
      const newRollover = {
        id: newRolloverId,
        title: `${currentChallengeDate} Run`,
        target_goal: 10,
        initial_stake: finalStake,
        base_odds: parseFloat(accumulatedOdds.toFixed(2)),
        match_id: matchIdInput || null,
        prediction: prediction
      };
      rollovers.push(newRollover);

      const winAmount = finalStake * parseFloat(accumulatedOdds.toFixed(2));
      const newStepId = steps.length > 0 ? Math.max(...steps.map(s => s.id)) + 1 : 1;

      const newStep = {
        id: newStepId,
        rollover_id: newRolloverId,
        day_number: 1,
        stake: finalStake,
        odds: parseFloat(accumulatedOdds.toFixed(2)),
        win_amount: winAmount,
        status: 'pending'
      };
      steps.push(newStep);

      localStorage.setItem(STORAGE_KEY_ROLLOVERS, JSON.stringify(rollovers));
      localStorage.setItem(STORAGE_KEY_STEPS, JSON.stringify(steps));
      
      setStagedMatches([]);
      setAccumulatedOdds(1.00);
      setKickOffTime('');
      setMatchIdInput('');
      fetchData();
      
      setActiveTab('goal');
      alert(`Coupon initialized and added to Local Storage successfully!`);
    } catch (err) {
      alert("Failed to save the slip to local storage.");
    }
  };

  // Download All App Data as JSON backup
  const handleDownloadBackupZip = () => {
    const backupData = {
      rollovers: localStorage.getItem(STORAGE_KEY_ROLLOVERS),
      steps: localStorage.getItem(STORAGE_KEY_STEPS),
      teamAnalysis: localStorage.getItem(STORAGE_KEY_TEAM_ANALYSIS),
      leagueData: localStorage.getItem(STORAGE_KEY_LEAGUE_DATA),
      settings: { username, theme },
      exportDate: new Date().toISOString()
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `League_Backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleToggleBetStatus = (betId, currentStatus) => {
    if (!isAdminLoggedIn) {
      alert("Access Denied! You must log in to the Admin Panel to mark Win or Loss.");
      return;
    }

    let nextStatus = 'pending';
    if (currentStatus === 'pending') nextStatus = 'win';
    else if (currentStatus === 'win') nextStatus = 'loss';

    try {
      const rawRollovers = localStorage.getItem(STORAGE_KEY_ROLLOVERS);
      const rawSteps = localStorage.getItem(STORAGE_KEY_STEPS);
      
      const rollovers = rawRollovers ? JSON.parse(rawRollovers) : [];
      let steps = rawSteps ? JSON.parse(rawSteps) : [];
      
      const targetStep = steps.find(s => s.id === betId);
      if (!targetStep) return;

      const parentRun = rollovers.find(r => String(r.id) === String(targetStep.rollover_id));

      steps = steps.map(step => step.id === betId ? { ...step, status: nextStatus } : step);

      if (nextStatus === 'win' && parentRun) {
        const existingNextStep = steps.find(s => String(s.rollover_id) === String(parentRun.id) && s.day_number === targetStep.day_number + 1);
        if (!existingNextStep) {
          const nextDay = targetStep.day_number + 1;
          const nextStake = Math.floor(targetStep.win_amount);
          const nextWinAmount = nextStake * parentRun.base_odds;
          const newStepId = steps.length > 0 ? Math.max(...steps.map(s => s.id)) + 1 : 1;

          steps.push({
            id: newStepId,
            rollover_id: parentRun.id,
            day_number: nextDay,
            stake: nextStake,
            odds: parentRun.base_odds,
            win_amount: nextWinAmount,
            status: 'pending'
          });
        }
      }

      localStorage.setItem(STORAGE_KEY_STEPS, JSON.stringify(steps));
      fetchData();
    } catch (err) {
      console.error("Status update error", err);
    }
  };

  useEffect(() => {
    const handleOutsideClick = () => setShowProfileDropdown(false);
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  return (
    <div 
      className={`theme-container theme-${theme}`} 
      style={{ backgroundImage: bgImage ? `url(${bgImage})` : 'none' }}
    >
      <div className="app-wrapper">
        
        {/* HEADER BLOCK */}
        <header onClick={(e) => e.stopPropagation()}>
          <div className="header-content">
            <div className="header-left">
              <h1>
                <i className="fa-solid fa-layer-group"></i> 
                League
              </h1>
              <p style={{ marginTop: '5px', color: '#3b82f6', opacity: 1, fontSize: '0.9rem' }}>
                ✦ East Africa eFootball Management & Standings ✧
              </p>
            </div>
            
            <div className="header-right">
              <div className="profile-dropdown">
                <button 
                  className="profile-btn" 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setShowProfileDropdown(!showProfileDropdown); 
                  }}
                >
                  <div id="profile-icon" style={{ backgroundImage: profilePic ? `url(${profilePic})` : 'none', backgroundSize: 'cover' }}>
                    {!profilePic && <i className="fas fa-user"></i>}
                  </div>
                </button>
                
                {showProfileDropdown && (
                  <div className="dropdown-content show" onClick={(e) => e.stopPropagation()}>
                    <div className="dropdown-header">
                      <div 
                        id="dropdown-profile-pic"
                        onClick={() => document.getElementById('profile-upload-input').click()}
                        style={{ position: 'relative', cursor: 'pointer', overflow: 'hidden', backgroundImage: profilePic ? `url(${profilePic})` : 'none', backgroundSize: 'cover' }}
                      >
                        {!profilePic && <i className="fas fa-user" id="avatar-icon"></i>}
                        <div className="upload-overlay">
                          <i className="fas fa-camera" style={{ fontSize: '0.75rem', color: 'white' }}></i>
                        </div>
                      </div>
                      <input type="file" id="profile-upload-input" accept="image/*" style={{ display: 'none' }} onChange={handleProfilePicChange} />
                      <div>
                        <strong id="display-username">{username}</strong>
                        <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>League Manager</div>
                      </div>
                    </div>
                    
                    <div className="dropdown-divider"></div>
                    
                    <a href="#dashboard" onClick={() => { setActiveTab('dashboard'); setShowProfileDropdown(false); }}>
                      <i className="fas fa-tachometer-alt"></i> Dashboard
                    </a>
                    <a href="#tables" onClick={() => { setActiveTab('tables'); setShowProfileDropdown(false); }}>
                      <i className="fa-solid fa-table"></i> League Tables & H2H
                    </a>
                    <a href="#goal" onClick={() => { setActiveTab('goal'); setShowProfileDropdown(false); }}>
                      <i className="fa-regular fa-circle-dot live-blue-dot"></i> Active bets
                    </a>
                    <a href="#transactions" onClick={() => { setActiveTab('transactions'); setShowProfileDropdown(false); }}>
                      <i className="fas fa-history"></i> My bets
                    </a>
                    
                    <a href="#backup" onClick={(e) => { e.preventDefault(); handleDownloadBackupZip(); setShowProfileDropdown(false); }} style={{ color: '#10b981', fontWeight: 'bold' }}>
                      <i className="fa-solid fa-download"></i> Download Data Backup (.json)
                    </a>

                    <a href="#admin" onClick={(e) => { e.preventDefault(); setShowAdminModal(true); setShowProfileDropdown(false); }} style={{ color: '#e74c3c', fontWeight: 'bold' }}>
                      <i className="fa-solid fa-lock"></i> Admin Panel
                    </a>

                    <div className="dropdown-divider"></div>

                    <div className={`settings-dropdown-accordion ${showSettingsAccordion ? 'open' : ''}`}>
                      <div className="settings-accordion-header" onClick={() => setShowSettingsAccordion(!showSettingsAccordion)}>
                        <span><i className="fa-solid fa-gear"></i> Settings</span>
                        <i className="fas fa-chevron-down settings-arrow"></i>
                      </div>
                      
                      {showSettingsAccordion && (
                        <div className="settings-accordion-content">
                          <div className="setting-item-row">
                            <label>Username:</label>
                            <input type="text" value={username} onChange={handleUsernameChange} />
                          </div>

                          <div className="setting-item-row">
                            <label>Color Theme:</label>
                            <select value={theme} onChange={handleThemeChange}>
                              <option value="default">Default Orange</option>
                              <option value="dark">Dark Theme</option>
                              <option value="blue">Blue Sky</option>
                              <option value="royal">Royal Purple</option>
                              <option value="pink">Vibrant Pink</option>
                              <option value="gray">Slate Gray</option>
                            </select>
                          </div>

                          <div className="setting-item-row">
                            <label>Wall Background:</label>
                            <button type="button" className="bg-upload-trigger-btn" onClick={() => document.getElementById('bg-upload-input').click()}>
                              <i className="fa-solid fa-image"></i> Import Image
                            </button>
                            <input type="file" id="bg-upload-input" accept="image/*" style={{ display: 'none' }} onChange={handleBgChange} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <nav>
            <button className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
              <i className="fas fa-home"></i> Home
            </button>
            <button className={`nav-btn ${activeTab === 'tables' ? 'active' : ''}`} onClick={() => setActiveTab('tables')}>
              <i className="fa-solid fa-table"></i> Tables & H2H
            </button>
            <button className={`nav-btn ${activeTab === 'goal' ? 'active' : ''}`} onClick={() => setActiveTab('goal')}>
              <i className="fa-regular fa-circle-dot live-blue-dot"></i> Active Bets
            </button>
            <button className={`nav-btn ${activeTab === 'transactions' ? 'active' : ''}`} onClick={() => setActiveTab('transactions')}>
              <i className="fa-solid fa-clock-rotate-left"></i> History
            </button>
          </nav>
        </header>

        {/* ADMIN MODAL PANEL */}
        {showAdminModal && (
          <div className="admin-modal-overlay" onClick={() => setShowAdminModal(false)}>
            <div className="admin-modal-content" onClick={(e) => e.stopPropagation()} style={{ background: '#ffffff', padding: '20px', borderRadius: '10px', maxWidth: '550px', width: '90%', margin: '30px auto', maxHeight: '85vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
                <h3 style={{ margin: 0, color: '#1e293b' }}><i className="fa-solid fa-shield-halved"></i> Admin Control Center</h3>
                <button onClick={() => setShowAdminModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}><i className="fa-solid fa-xmark"></i></button>
              </div>

              {!isAdminLoggedIn ? (
                <form onSubmit={handleAdminLogin}>
                  <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Please enter admin password to manage team details & bet statuses. (Default: 1234)</p>
                  <div className="input-group" style={{ margin: '15px 0' }}>
                    <label>Admin Password</label>
                    <input type="password" placeholder="Enter password (e.g., 1234)" value={adminPasswordInput} onChange={(e) => setAdminPasswordInput(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} />
                  </div>
                  <button type="submit" className="create-slip-btn" style={{ width: '100%', backgroundColor: '#2563eb', color: 'white', padding: '10px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Login to Admin</button>
                </form>
              ) : (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f1f5f9', padding: '10px', borderRadius: '6px', marginBottom: '15px' }}>
                    <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 'bold' }}><i className="fa-solid fa-circle-check"></i> Admin Authenticated</span>
                    <button onClick={() => setIsAdminLoggedIn(false)} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>Logout</button>
                  </div>

                  {/* ADMIN TEAM EDITOR SECTION */}
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', marginBottom: '15px' }}>
                    <h4 style={{ color: '#1e293b', marginTop: 0, marginBottom: '8px', fontSize: '0.95rem' }}>
                      <i className="fa-solid fa-pen-to-square"></i> Add/Edit Team Details (Corners, Results & H2H)
                    </h4>
                    <form onSubmit={handleAdminSaveTeamDetails}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                        <div>
                          <label style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>League</label>
                          <select value={adminEditLeague} onChange={(e) => setAdminEditLeague(e.target.value)} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                            <option value="La Liga">La Liga</option>
                            <option value="EPL">EPL</option>
                            <option value="Bundesliga">Bundesliga</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Team Name (e.g., Barcelona)</label>
                          <input type="text" value={adminEditTeamName} onChange={(e) => setAdminEditTeamName(e.target.value)} required style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                        <div>
                          <label style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Corners Avg</label>
                          <input type="number" step="0.1" value={adminEditCorners} onChange={(e) => setAdminEditCorners(e.target.value)} required style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Goals Scored</label>
                          <input type="number" step="0.1" value={adminEditGoalsScored} onChange={(e) => setAdminEditGoalsScored(e.target.value)} required style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Goals Conceded</label>
                          <input type="number" step="0.1" value={adminEditGoalsConceded} onChange={(e) => setAdminEditGoalsConceded(e.target.value)} required style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                        </div>
                      </div>

                      <div style={{ marginBottom: '10px' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Recent Results Form (Comma separated, e.g., W,W,D,L,W)</label>
                        <input type="text" value={adminEditForm} onChange={(e) => setAdminEditForm(e.target.value)} placeholder="W,W,D,L,W" style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                      </div>

                      <button type="submit" style={{ background: '#2563eb', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem', width: '100%', fontWeight: 'bold' }}>
                        Save Team Details
                      </button>
                    </form>
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <button onClick={() => setShowChangePassSection(!showChangePassSection)} style={{ background: '#f59e0b', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}>
                      <i className="fa-solid fa-key"></i> {showChangePassSection ? "Cancel Password Change" : "Change Admin Password"}
                    </button>

                    {showChangePassSection && (
                      <form onSubmit={handleChangeAdminPassword} style={{ marginTop: '10px', padding: '10px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                        <div style={{ marginBottom: '8px' }}>
                          <label style={{ fontSize: '0.75rem' }}>Old Password</label>
                          <input type="password" value={oldPassInput} onChange={(e) => setOldPassInput(e.target.value)} required style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }} />
                        </div>
                        <div style={{ marginBottom: '8px' }}>
                          <label style={{ fontSize: '0.75rem' }}>New Password</label>
                          <input type="password" value={newPassInput} onChange={(e) => setNewPassInput(e.target.value)} required style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }} />
                        </div>
                        <div style={{ marginBottom: '8px' }}>
                          <label style={{ fontSize: '0.75rem' }}>Confirm New Password</label>
                          <input type="password" value={confirmPassInput} onChange={(e) => setConfirmPassInput(e.target.value)} required style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }} />
                        </div>
                        <button type="submit" style={{ background: '#10b981', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>Save New Password</button>
                      </form>
                    )}
                  </div>

                  <h4 style={{ color: '#1e293b', borderBottom: '1px solid #eee', paddingBottom: '6px' }}>Manage Active Bets Status</h4>
                  {rolloverRuns.length === 0 ? (
                    <p style={{ fontSize: '0.85rem', color: '#64748b' }}>No active runs found in local storage database.</p>
                  ) : (
                    rolloverRuns.map(run => (
                      <div key={run.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '10px', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <strong>{run.title}</strong>
                          <button onClick={() => handleDeleteRolloverRun(run.id)} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '3px 6px', borderRadius: '3px', cursor: 'pointer', fontSize: '0.75rem' }}><i className="fa-solid fa-trash"></i> Delete Slip</button>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: '#555', margin: '4px 0' }}>Market: {run.prediction}</p>
                        
                        <div style={{ marginTop: '8px' }}>
                          {run.steps && run.steps.map(step => (
                            <div key={step.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '6px', borderRadius: '4px', marginBottom: '4px', border: '1px solid #ddd', fontSize: '0.8rem' }}>
                              <span>Day {step.day_number} | Stake: {parseFloat(step.stake).toLocaleString()} TZS</span>
                              <button 
                                onClick={() => handleToggleBetStatus(step.id, step.status)}
                                style={{ 
                                  padding: '3px 8px', 
                                  borderRadius: '4px', 
                                  border: 'none', 
                                  cursor: 'pointer', 
                                  fontWeight: 'bold',
                                  backgroundColor: step.status === 'win' ? '#10b981' : step.status === 'loss' ? '#ef4444' : '#f59e0b',
                                  color: 'white',
                                  fontSize: '0.75rem'
                                }}
                              >
                                {step.status === 'win' ? '✔ WIN' : step.status === 'loss' ? '✘ LOSS' : 'PENDING'}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TEAM DETAIL MODAL WITH ROUND COLORS GRAPH (IMAGE 2 STYLE) */}
        {selectedTeamDetail && (
          <div className="admin-modal-overlay" onClick={() => setSelectedTeamDetail(null)}>
            <div className="admin-modal-content" onClick={(e) => e.stopPropagation()} style={{ background: '#1e293b', color: '#fff', padding: '20px', borderRadius: '12px', maxWidth: '450px', width: '90%', margin: '40px auto', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', marginBottom: '15px' }}>
                <h3 style={{ margin: 0, color: '#38bdf8' }}><i className="fa-solid fa-shield-cat"></i> {selectedTeamDetail.name} Club Analytics</h3>
                <button onClick={() => setSelectedTeamDetail(null)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}><i className="fa-solid fa-xmark"></i></button>
              </div>

              {/* ROUND COLORS GRAPH & FORM DISTRIBUTION (IMAGE 2 STYLE) */}
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '8px', marginBottom: '15px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '10px', fontWeight: 'bold' }}>Recent Form & Match Outcomes Graph</div>
                
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '10px' }}>
                  {selectedTeamDetail.recentForm && selectedTeamDetail.recentForm.map((res, idx) => {
                    let bgColor = '#10b981'; // Win Green
                    if (res === 'D') bgColor = '#f59e0b'; // Draw Yellow/Orange
                    else if (res === 'L') bgColor = '#ef4444'; // Loss Red

                    return (
                      <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ 
                          width: '36px', 
                          height: '36px', 
                          borderRadius: '50%', 
                          background: bgColor, 
                          color: '#fff', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          fontWeight: 'bold', 
                          fontSize: '0.85rem',
                          boxShadow: '0 2px 5px rgba(0,0,0,0.3)'
                        }}>
                          {res}
                        </div>
                        <span style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '4px' }}>R{idx+1}</span>
                      </div>
                    );
                  })}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#38bdf8' }}>🟢 Win (Green) | 🟡 Draw (Orange) | 🔴 Loss (Red)</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Goals Scored / Match</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#10b981', marginTop: '4px' }}>{selectedTeamDetail.goalsScoredAvg}</div>
                  <div style={{ fontSize: '0.65rem', color: '#10b981', marginTop: '2px' }}>High Scoring Rate</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Goals Conceded / Match</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#ef4444', marginTop: '4px' }}>{selectedTeamDetail.goalsConcededAvg}</div>
                  <div style={{ fontSize: '0.65rem', color: '#ef4444', marginTop: '2px' }}>Defensive Record</div>
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px', marginBottom: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Average Corners Per Match:</span>
                  <strong style={{ color: '#38bdf8', fontSize: '1.1rem' }}>{selectedTeamDetail.cornersAvg}</strong>
                </div>
                <div style={{ width: '100%', background: 'rgba(255,255,255,0.1)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${(selectedTeamDetail.cornersAvg / 10) * 100}%`, background: '#38bdf8', height: '100%' }}></div>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '6px' }}>
                  💡 Market Tip: {selectedTeamDetail.cornersAvg >= 5.5 ? "Over 8.5 Corners Recommended" : "Standard Corner Play"}
                </div>
              </div>

              <div style={{ background: '#0f172a', padding: '12px', borderRadius: '8px', fontSize: '0.8rem', color: '#cbd5e1', lineHeight: '1.4' }}>
                <strong style={{ color: '#f59e0b' }}>League Insights:</strong> This team is fully registered for East African eFootball league pairings and tournament match points tracking[span_0](start_span)[span_0](end_span).
              </div>
            </div>
          </div>
        )}

        {/* MAIN BODY CONTENT */}
        <main className="content-container">
          
          {/* TAB 1: Dashboard View */}
          {activeTab === 'dashboard' && (
            <section id="dashboard-view" className="page-view active" style={{ display: 'block' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ color: '#1e293b' }}>League Hub</h2>
              </div>

              {/* ACCORDION 1: CREATE BETSLIP */}
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
                      <div className="input-group">
                        <label>Kick-off</label>
                        <input type="time" value={kickOffTime} onChange={(e) => setKickOffTime(e.target.value)} />
                      </div>
                    </div>

                    <div className="form-row-base" style={{ marginTop: '5px' }}>
                      <div className="input-group" style={{ display: 'none' }}>
                        <input type="text" value={matchIdInput} onChange={(e) => setMatchIdInput(e.target.value)} />
                      </div>
                      <div className="input-group" style={{ width: '100%' }}>
                        <label>Prediction Selection Rule</label>
                        <select value={prediction} onChange={(e) => setPrediction(e.target.value)} style={{ padding: '8px', borderRadius: '6px' }}>
                          <option value="Over 1.5">Over 1.5 Goals</option>
                          <option value="Over 2.5">Over 2.5 Goals</option>
                          <option value="Under 3.5">Under 3.5 Goals</option>
                          <option value="Home Win">Home Win (1)</option>
                          <option value="Away Win">Away Win (2)</option>
                          <option value="BTTS Yes">Both Teams to Score: Yes</option>
                        </select>
                      </div>
                    </div>

                    <div className="added-teams-summary">
                      {stagedMatches.length > 0 ? stagedMatches.join(' | ') : null}
                    </div>

                    <div className="accumulator-input-row">
                      <input type="text" placeholder="Home Team" value={homeTeam} onChange={(e) => setHomeTeam(e.target.value)} />
                      <span className="vs-text">vs</span>
                      <input type="text" placeholder="Away Team" value={awayTeam} onChange={(e) => setAwayTeam(e.target.value)} />
                      <input type="number" step="0.01" placeholder="Odds" style={{ width: '80px' }} value={matchOdd} onChange={(e) => setMatchOdd(e.target.value)} />
                      <button type="button" onClick={handleAppendMatch} className="append-plus-btn">
                        <i className="fa-solid fa-plus"></i>
                      </button>
                    </div>

                    <button type="submit" className="create-slip-btn" style={{ marginTop: '10px' }}>Generate Active Slip</button>
                  </form>
                </div>
              </div>

              {/* ACCORDION 2: FLASHSCORE MOBI */}
              <div className={`history-dropdown-card ${openLiveScore ? 'open' : ''}`} style={{ marginTop: '15px' }}>
                <div className="history-header-toggle" onClick={() => setOpenLiveScore(!openLiveScore)} style={{ backgroundColor: '#f1f5f9' }}>
                  <p className="history-title-paragraph" style={{ fontWeight: 'bold' }}>
                    <i className="fa-solid fa-clock" style={{ color: '#e74c3c', marginRight: '6px' }}></i> Flashscore Mobile Web Portal
                  </p>
                  <i className="fas fa-chevron-down toggle-arrow"></i>
                </div>
                <div className="history-content-collapsible" style={{ display: openLiveScore ? 'block' : 'none', padding: '10px' }}>
                  <div className="iframe-display-container">
                    <iframe src="https://flashscore.mobi/" title="Flashscore Web Frame"></iframe>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* TAB 2: LEAGUE TABLES & H2H VIEW */}
          {activeTab === 'tables' && (
            <section id="tables-view" className="page-view active" style={{ display: 'block' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
                <h2 style={{ color: '#1e293b', margin: 0 }}><i className="fa-solid fa-table"></i> League Standings & H2H</h2>
                
                {/* League Selector Dropdown */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <select 
                    value={selectedLeague} 
                    onChange={(e) => setSelectedLeague(e.target.value)}
                    style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: 'bold', background: '#fff', color: '#1e293b' }}
                  >
                    <option value="La Liga">🇪🇸 La Liga</option>
                    <option value="EPL">🇬🇧 Premier League (EPL)</option>
                    <option value="Bundesliga">🇩🇪 Bundesliga</option>
                  </select>

                  <select 
                    value={leagueSubView} 
                    onChange={(e) => setLeagueSubView(e.target.value)}
                    style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: 'bold', background: '#2563eb', color: '#fff' }}
                  >
                    <option value="table">Table View</option>
                    <option value="h2h">H2H Comparison</option>
                  </select>
                </div>
              </div>

              {/* TABLE SUB-VIEW */}
              {leagueSubView === 'table' && (
                <div style={{ background: '#1e293b', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                  <div style={{ padding: '12px 15px', background: '#0f172a', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>{selectedLeague} 2026-2027 Season</span>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Tap any team to view detailed stats</span>
                  </div>

                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff', fontSize: '0.85rem', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8', fontSize: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                          <th style={{ padding: '10px' }}>Club</th>
                          <th style={{ padding: '10px', textAlign: 'center' }}>MP</th>
                          <th style={{ padding: '10px', textAlign: 'center' }}>W</th>
                          <th style={{ padding: '10px', textAlign: 'center' }}>D</th>
                          <th style={{ padding: '10px', textAlign: 'center' }}>L</th>
                          <th style={{ padding: '10px', textAlign: 'center' }}>GF</th>
                          <th style={{ padding: '10px', textAlign: 'center' }}>GA</th>
                          <th style={{ padding: '10px', textAlign: 'center' }}>GD</th>
                          <th style={{ padding: '10px', textAlign: 'center' }}>Pts</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leagueTeamsData[selectedLeague].map((team) => (
                          <tr 
                            key={team.name}
                            onClick={() => setSelectedTeamDetail(team)}
                            style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', transition: 'background 0.2s' }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(56, 189, 248, 0.1)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                          >
                            <td style={{ padding: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ color: '#94a3b8', minWidth: '18px', textAlign: 'right' }}>{team.rank}</span>
                              <strong style={{ color: '#f8fafc' }}>{team.name}</strong>
                            </td>
                            <td style={{ padding: '10px', textAlign: 'center' }}>{team.mp}</td>
                            <td style={{ padding: '10px', textAlign: 'center' }}>{team.w}</td>
                            <td style={{ padding: '10px', textAlign: 'center' }}>{team.d}</td>
                            <td style={{ padding: '10px', textAlign: 'center' }}>{team.l}</td>
                            <td style={{ padding: '10px', textAlign: 'center' }}>{team.gf}</td>
                            <td style={{ padding: '10px', textAlign: 'center' }}>{team.ga}</td>
                            <td style={{ padding: '10px', textAlign: 'center' }}>{team.gd}</td>
                            <td style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold', color: '#38bdf8' }}>{team.pts}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* H2H SUB-VIEW */}
              {leagueSubView === 'h2h' && (
                <div style={{ background: '#fff', borderRadius: '10px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                  <h3 style={{ fontSize: '1rem', color: '#1e293b', marginBottom: '15px' }}>Head-to-Head (H2H) Team Comparison</h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#64748b' }}>Team A</label>
                      <select 
                        value={h2hTeamA} 
                        onChange={(e) => setH2hTeamA(e.target.value)}
                        style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px' }}
                      >
                        {leagueTeamsData[selectedLeague].map(t => (
                          <option key={t.name} value={t.name}>{t.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#64748b' }}>Team B</label>
                      <select 
                        value={h2hTeamB} 
                        onChange={(e) => setH2hTeamB(e.target.value)}
                        style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px' }}
                      >
                        {leagueTeamsData[selectedLeague].map(t => (
                          <option key={t.name} value={t.name}>{t.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {(() => {
                    const teamAObj = leagueTeamsData[selectedLeague].find(t => t.name === h2hTeamA) || leagueTeamsData[selectedLeague][0];
                    const teamBObj = leagueTeamsData[selectedLeague].find(t => t.name === h2hTeamB) || leagueTeamsData[selectedLeague][1];

                    return (
                      <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
                          <div style={{ textAlign: 'center', flex: 1 }}>
                            <strong style={{ fontSize: '1.1rem', color: '#1e293b' }}>{teamAObj.name}</strong>
                            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Goals/Match: {teamAObj.goalsScoredAvg}</div>
                          </div>
                          <div style={{ fontWeight: 'bold', color: '#ef4444', padding: '0 10px' }}>VS</div>
                          <div style={{ textAlign: 'center', flex: 1 }}>
                            <strong style={{ fontSize: '1.1rem', color: '#1e293b' }}>{teamBObj.name}</strong>
                            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Goals/Match: {teamBObj.goalsScoredAvg}</div>
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.85rem' }}>
                          <div style={{ background: '#fff', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                            <div style={{ fontWeight: 'bold', color: '#3b82f6', marginBottom: '4px' }}>{teamAObj.name} Metrics</div>
                            <div>Corners Avg: {teamAObj.cornersAvg}</div>
                            <div>Conceded Avg: {teamAObj.goalsConcededAvg}</div>
                          </div>
                          <div style={{ background: '#fff', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                            <div style={{ fontWeight: 'bold', color: '#3b82f6', marginBottom: '4px' }}>{teamBObj.name} Metrics</div>
                            <div>Corners Avg: {teamBObj.cornersAvg}</div>
                            <div>Conceded Avg: {teamBObj.goalsConcededAvg}</div>
                          </div>
                        </div>

                        <div style={{ marginTop: '12px', background: '#eff6ff', padding: '10px', borderRadius: '6px', fontSize: '0.8rem', color: '#1e40af' }}>
                          <i className="fa-solid fa-chart-line"></i> <strong>H2H Prediction Insight:</strong> Combined scoring averages indicate a high probability of both teams scoring (BTTS) and over 2.5 total match goals.
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
            <section id="goal-view" className="page-view active" style={{ display: 'block' }}>
              <h2 style={{ marginBottom: '15px', color: '#333' }}>Active Bets</h2>
              <div id="active-bets-target-list">
                {loading ? (
                  <p style={{ textAlign: 'center', color: '#64748b' }}>Syncing local operations...</p>
                ) : rolloverRuns.length === 0 ? (
                  <p style={{ color: '#64748b', textAlign: 'center', padding: '20px', fontSize: '0.85rem' }}>No current active operations running.</p>
                ) : (
                  rolloverRuns.map((run) => {
                    const isExpanded = expandedRunId === run.id;
                    const displaySteps = run.steps && run.steps.length > 0 ? run.steps : [
                      {
                        id: `fallback-${run.id}`,
                        day_number: 1,
                        stake: run.initial_stake || 1000,
                        odds: run.base_odds || 1.50,
                        win_amount: (run.initial_stake || 1000) * (run.base_odds || 1.50),
                        status: 'pending'
                      }
                    ];

                    return (
                      <div 
                        className={`history-dropdown-card ${isExpanded ? 'open' : ''}`} 
                        key={run.id} 
                        style={{ borderLeft: '4px solid #00b0ff', marginBottom: '20px', cursor: 'pointer', backgroundColor: isExpanded ? '#e3f2fd' : '#ffffff' }}
                        onClick={() => setExpandedRunId(isExpanded ? null : run.id)}
                      >
                        <div className="history-header-toggle" style={{ display: 'block', padding: '12px' }}>
                          <p className="history-title-paragraph" style={{ margin: 0 }}>
                            <strong>Active Run:</strong> {run.title}
                          </p>
                          <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#555' }}>
                            Market: {run.prediction}
                          </p>
                        </div>
                        
                        {!isExpanded && (
                          <div style={{ padding: '0 12px 12px 12px', display: 'flex', gap: '20px', fontSize: '0.85rem', color: '#475569' }}>
                            <span><strong>Stake:</strong> {parseFloat(run.initial_stake || 1000).toLocaleString()} TZS</span>
                            <span><strong>Total Odds:</strong> @{parseFloat(run.base_odds || 1.00).toFixed(2)}</span>
                          </div>
                        )}

                        <div 
                          className="history-content-collapsible" 
                          style={{ display: isExpanded ? 'block' : 'none', padding: '10px', backgroundColor: '#ffffff' }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="table-scroll-wrapper">
                            <table className="history-data-table">
                              <thead>
                                <tr>
                                  <th>DAY</th>
                                  <th>STAKE</th>
                                  <th>ODD</th>
                                  <th>WIN</th>
                                  <th>STATUS</th>
                                </tr>
                              </thead>
                              <tbody>
                                {displaySteps.map((step) => (
                                  <tr key={step.id}>
                                    <td>Day {step.day_number}</td>
                                    <td>{parseFloat(step.stake).toLocaleString()} TZS</td>
                                    <td>@{parseFloat(step.odds).toFixed(2)}</td>
                                    <td>{parseFloat(step.win_amount).toLocaleString()} TZS</td>
                                    <td>
                                      <span 
                                        style={{ 
                                          padding: '4px 8px', 
                                          borderRadius: '4px', 
                                          fontWeight: 'bold',
                                          display: 'inline-block',
                                          backgroundColor: step.status === 'win' ? '#10b981' : step.status === 'loss' ? '#ef4444' : '#f59e0b',
                                          color: 'white',
                                          fontSize: '0.75rem'
                                        }}
                                      >
                                        {step.status === 'win' ? '✔ WIN' : step.status === 'loss' ? '✘ LOSS' : 'PENDING'}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </section>
          )}

          {/* TAB 4: My Bets History */}
          {activeTab === 'transactions' && (
            <section id="transactions-view" className="page-view active" style={{ display: 'block' }}>
              <h2 style={{ marginBottom: '15px', color: '#333' }}>Bets History</h2>
              <div id="history-bets-target-list">
                {rolloverRuns.length === 0 ? (
                  <p style={{ color: '#64748b', textAlign: 'center', padding: '20px', fontSize: '0.85rem' }}>No historical data records verified yet.</p>
                ) : (
                  rolloverRuns.map(run => {
                    const settledSteps = run.steps ? run.steps.filter(s => s.status === 'win' || s.status === 'loss') : [];
                    let statusIcon = '⏳'; 
                    if (settledSteps.some(s => s.status === 'loss')) statusIcon = '❌';
                    else if (settledSteps.length > 0 && settledSteps.every(s => s.status === 'win')) statusIcon = '✅';

                    return (
                      <div className="history-dropdown-card" key={run.id}>
                        <div className="history-header-toggle" onClick={() => alert(`Staged Details: ${run.title}`)}>
                          <p className="history-title-paragraph">
                            <strong>Challenge Run:</strong> {run.title} (Settled: {settledSteps.length} Days)
                          </p>
                          <span style={{ fontSize: '0.9rem', marginLeft: '6px', flexShrink: 0 }}>
                            {statusIcon}
                          </span>
                        </div>
                      </div>
                    );
                  })
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
