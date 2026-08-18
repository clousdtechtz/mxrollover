import React, { useState, useEffect } from 'react';

// Local storage key constants
const STORAGE_KEY_ROLLOVERS = 'mxrollover_local_rollovers';
const STORAGE_KEY_STEPS = 'mxrollover_local_steps';
const STORAGE_KEY_ADMIN_PASS = 'mxrollover_admin_password';
const STORAGE_KEY_TEAM_ANALYSIS = 'mxrollover_team_analysis_logs';
const STORAGE_KEY_LEAGUE_DATA = 'mxrollover_custom_league_teams_data';
const STORAGE_KEY_NOTEPAD = 'mxrollover_local_notepad_content';
const STORAGE_KEY_BET_SCREENSHOTS = 'mxrollover_local_bet_screenshots';

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
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showSettingsAccordion, setShowSettingsAccordion] = useState(false);
  const [username, setUsername] = useState(() => localStorage.getItem('userProfileUsername') || 'Savings User');
  const [theme, setTheme] = useState(() => localStorage.getItem('userProfileTheme') || 'default');
  const [profilePic, setProfilePic] = useState(() => localStorage.getItem('userProfileImage') || null);
  
  const [bgImage, setBgImage] = useState(() => {
    const active = localStorage.getItem('useCustomBgActive') === 'true';
    return active ? localStorage.getItem('userProfileCustomBg') : null;
  });

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

  const [baseStake, setBaseStake] = useState('1000');
  const [kickOffTime, setKickOffTime] = useState('');
  const [stagedMatches, setStagedMatches] = useState([]);
  const [accumulatedOdds, setAccumulatedOdds] = useState(1.00);
  const [matchIdInput, setMatchIdInput] = useState('');
  const [prediction, setPrediction] = useState('Over 1.5');
  
  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');
  const [matchOdd, setMatchOdd] = useState('');

  const [rolloverRuns, setRolloverRuns] = useState([]);
  const [loading, setLoading] = useState(true);

  // Updated Navigation Dropdown Category State replacing Table & H2H (Default is Rov2)
  const [selectedNavCategory, setSelectedNavCategory] = useState('Rov2');
  
  const [selectedTeamDetail, setSelectedTeamDetail] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null); // Lightbox state for full screen screenshots

  // Notepad State
  const [notepadContent, setNotepadContent] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_NOTEPAD) || '';
  });

  // Bet Screenshots History State
  const [betScreenshots, setBetScreenshots] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_BET_SCREENSHOTS);
    return saved ? JSON.parse(saved) : [];
  });

  // Admin Screenshot Uploader State
  const [adminScreenshotTitle, setAdminScreenshotTitle] = useState('');
  const [adminScreenshotImage, setAdminScreenshotImage] = useState('');

  const [leagueTeamsData, setLeagueTeamsData] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_LEAGUE_DATA);
    return saved ? JSON.parse(saved) : INITIAL_LEAGUE_TEAMS;
  });

  // Admin Team Editor Form States with Dropdowns & Numerical constraints (0-9 goals, 0-30 corners)
  const [adminEditLeague, setAdminEditLeague] = useState('La Liga');
  const [adminEditTeamName, setAdminEditTeamName] = useState('Barcelona');
  const [adminEditAwayTeamName, setAdminEditAwayTeamName] = useState('Alavés');
  const [adminEditHomeGoals, setAdminEditHomeGoals] = useState('1');
  const [adminEditAwayGoals, setAdminEditAwayGoals] = useState('0');
  const [adminEditHomeCorners, setAdminEditHomeCorners] = useState('6');
  const [adminEditAwayCorners, setAdminEditAwayCorners] = useState('4');

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

  // Handle Admin Importing Screenshot History
  const handleAdminImportScreenshot = (e) => {
    e.preventDefault();
    if (!isAdminLoggedIn) {
      alert("Admin authorization required!");
      return;
    }
    if (!adminScreenshotImage) {
      alert("Please select a screenshot image file to import.");
      return;
    }

    const newScreenshotItem = {
      id: Date.now(),
      title: adminScreenshotTitle || `Bet Screenshot ${betScreenshots.length + 1}`,
      image: adminScreenshotImage,
      date: new Date().toLocaleDateString()
    };

    const updatedScreenshots = [newScreenshotItem, ...betScreenshots];
    setBetScreenshots(updatedScreenshots);
    localStorage.setItem(STORAGE_KEY_BET_SCREENSHOTS, JSON.stringify(updatedScreenshots));

    setAdminScreenshotTitle('');
    setAdminScreenshotImage('');
    alert("Bet screenshot successfully imported into history!");
  };

  // Handle Admin Saving Match Details with complete standard football table calculations (MP, W, D, L, GF, GA, GD, Pts, Form, Rankings)
  const handleAdminSaveTeamDetails = (e) => {
    e.preventDefault();
    if (!isAdminLoggedIn) {
      alert("Admin authorization required!");
      return;
    }

    if (adminEditTeamName === adminEditAwayTeamName) {
      alert("Home team and Away team cannot be the same!");
      return;
    }

    const updatedData = { ...leagueTeamsData };
    const leagueList = updatedData[adminEditLeague];
    if (!leagueList) return;

    const homeGoals = parseInt(adminEditHomeGoals, 10) || 0;
    const awayGoals = parseInt(adminEditAwayGoals, 10) || 0;
    const homeCorners = parseFloat(adminEditHomeCorners) || 0;
    const awayCorners = parseFloat(adminEditAwayCorners) || 0;

    const homeIndex = leagueList.findIndex(t => t.name.toLowerCase() === adminEditTeamName.toLowerCase());
    const awayIndex = leagueList.findIndex(t => t.name.toLowerCase() === adminEditAwayTeamName.toLowerCase());

    if (homeIndex === -1 || awayIndex === -1) {
      alert("Could not find selected teams in the league database.");
      return;
    }

    const homeTeamObj = leagueList[homeIndex];
    const awayTeamObj = leagueList[awayIndex];

    let homeWinInc = 0, homeDrawInc = 0, homeLossInc = 0, homePtsInc = 0, homeFormRes = 'L';
    let awayWinInc = 0, awayDrawInc = 0, awayLossInc = 0, awayPtsInc = 0, awayFormRes = 'L';

    if (homeGoals > awayGoals) {
      homeWinInc = 1; homePtsInc = 3; homeFormRes = 'W';
      awayLossInc = 1; awayFormRes = 'L';
    } else if (homeGoals < awayGoals) {
      awayWinInc = 1; awayPtsInc = 3; awayFormRes = 'W';
      homeLossInc = 1; homeFormRes = 'L';
    } else {
      homeDrawInc = 1; homePtsInc = 1; homeFormRes = 'D';
      awayDrawInc = 1; awayPtsInc = 1; awayFormRes = 'D';
    }

    const newHomeMp = homeTeamObj.mp + 1;
    const newHomeW = homeTeamObj.w + homeWinInc;
    const newHomeD = homeTeamObj.d + homeDrawInc;
    const newHomeL = homeTeamObj.l + homeLossInc;
    const newHomeGf = homeTeamObj.gf + homeGoals;
    const newHomeGa = homeTeamObj.ga + awayGoals;
    const newHomeGd = newHomeGf - newHomeGa;
    const newHomePts = homeTeamObj.pts + homePtsInc;
    const newHomeCornersAvg = parseFloat(((homeTeamObj.cornersAvg * homeTeamObj.mp + homeCorners) / newHomeMp).toFixed(1));
    const newHomeGoalsScoredAvg = parseFloat((newHomeGf / newHomeMp).toFixed(2));
    const newHomeGoalsConcededAvg = parseFloat((newHomeGa / newHomeMp).toFixed(2));
    const newHomeForm = [...(homeTeamObj.recentForm || []), homeFormRes].slice(-5);

    leagueList[homeIndex] = {
      ...homeTeamObj,
      mp: newHomeMp,
      w: newHomeW,
      d: newHomeD,
      l: newHomeL,
      gf: newHomeGf,
      ga: newHomeGa,
      gd: newHomeGd,
      pts: newHomePts,
      cornersAvg: newHomeCornersAvg,
      goalsScoredAvg: newHomeGoalsScoredAvg,
      goalsConcededAvg: newHomeGoalsConcededAvg,
      recentForm: newHomeForm
    };

    const newAwayMp = awayTeamObj.mp + 1;
    const newAwayW = awayTeamObj.w + awayWinInc;
    const newAwayD = awayTeamObj.d + awayDrawInc;
    const newAwayL = awayTeamObj.l + awayLossInc;
    const newAwayGf = awayTeamObj.gf + awayGoals;
    const newAwayGa = awayTeamObj.ga + homeGoals;
    const newAwayGd = newAwayGf - newAwayGa;
    const newAwayPts = awayTeamObj.pts + awayPtsInc;
    const newAwayCornersAvg = parseFloat(((awayTeamObj.cornersAvg * awayTeamObj.mp + awayCorners) / newAwayMp).toFixed(1));
    const newAwayGoalsScoredAvg = parseFloat((newAwayGf / newAwayMp).toFixed(2));
    const newAwayGoalsConcededAvg = parseFloat((newAwayGa / newAwayMp).toFixed(2));
    const newAwayForm = [...(awayTeamObj.recentForm || []), awayFormRes].slice(-5);

    leagueList[awayIndex] = {
      ...awayTeamObj,
      mp: newAwayMp,
      w: newAwayW,
      d: newAwayD,
      l: newAwayL,
      gf: newAwayGf,
      ga: newAwayGa,
      gd: newAwayGd,
      pts: newAwayPts,
      cornersAvg: newAwayCornersAvg,
      goalsScoredAvg: newAwayGoalsScoredAvg,
      goalsConcededAvg: newAwayGoalsConcededAvg,
      recentForm: newAwayForm
    };

    leagueList.sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts;
      if (b.gd !== a.gd) return b.gd - a.gd;
      if (b.gf !== a.gf) return b.gf - a.gf;
      return a.name.localeCompare(b.name);
    });

    leagueList.forEach((team, idx) => {
      team.rank = idx + 1;
    });

    updatedData[adminEditLeague] = leagueList;
    setLeagueTeamsData(updatedData);
    localStorage.setItem(STORAGE_KEY_LEAGUE_DATA, JSON.stringify(updatedData));
    alert(`Successfully recorded fixture results for ${adminEditTeamName} ${homeGoals}-${awayGoals} ${adminEditAwayTeamName} in ${adminEditLeague}. Standings recalculated!`);
  };

  const handleAppendMatch = (e) => {
    e.preventDefault();
    if (!homeTeam || !awayTeam || !prediction || isNaN(parseFloat(matchOdd))) {
      alert("Please fill all single row match properties before adding.");
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
      alert("Please add at least one match to your coupon first.");
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
      alert("Failed to save the slip.");
    }
  };

  const handleDownloadBackupZip = () => {
    const backupData = {
      rollovers: localStorage.getItem(STORAGE_KEY_ROLLOVERS),
      steps: localStorage.getItem(STORAGE_KEY_STEPS),
      teamAnalysis: localStorage.getItem(STORAGE_KEY_TEAM_ANALYSIS),
      leagueData: localStorage.getItem(STORAGE_KEY_LEAGUE_DATA),
      notepad: localStorage.getItem(STORAGE_KEY_NOTEPAD),
      screenshots: localStorage.getItem(STORAGE_KEY_BET_SCREENSHOTS),
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
      alert("Access Denied! Admin login required.");
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
                      <input type="file" id="profile-upload-input" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setProfilePic(reader.result);
                            localStorage.setItem('userProfileImage', reader.result);
                          };
                          reader.readAsDataURL(file);
                        }
                      }} />
                      <div>
                        <strong>{username}</strong>
                        <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>League Manager</div>
                      </div>
                    </div>
                    
                    <div className="dropdown-divider"></div>
                    
                    <a href="#dashboard" onClick={() => { setActiveTab('dashboard'); setShowProfileDropdown(false); }}>
                      <i className="fas fa-tachometer-alt"></i> Dashboard
                    </a>
                    <a href="#tables" onClick={() => { setActiveTab('tables'); setShowProfileDropdown(false); }}>
                      <i className="fa-solid fa-table"></i> Notepad & Bet Screenshots
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
                            <input type="text" value={username} onChange={(e) => {
                              setUsername(e.target.value);
                              localStorage.setItem('userProfileUsername', e.target.value);
                            }} />
                          </div>

                          <div className="setting-item-row">
                            <label>Color Theme:</label>
                            <select value={theme} onChange={(e) => {
                              setTheme(e.target.value);
                              setBgImage(null);
                              localStorage.setItem('userProfileTheme', e.target.value);
                              localStorage.setItem('useCustomBgActive', 'false');
                            }}>
                              <option value="default">Default Orange</option>
                              <option value="dark">Dark Theme</option>
                              <option value="blue">Blue Sky</option>
                              <option value="royal">Royal Purple</option>
                              <option value="pink">Vibrant Pink</option>
                              <option value="gray">Slate Gray</option>
                            </select>
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
            <button className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')} style={{ padding: '6px 10px', fontSize: '0.85rem' }}>
              <i className="fas fa-home"></i> Home
            </button>
            <button className={`nav-btn ${activeTab === 'tables' ? 'active' : ''}`} onClick={() => setActiveTab('tables')} style={{ padding: '6px 10px', fontSize: '0.85rem' }}>
              <i className="fa-solid fa-clipboard-list"></i> Notepad & Screenshots[span_0](start_span)[span_0](end_span)
            </button>
            <button className={`nav-btn ${activeTab === 'goal' ? 'active' : ''}`} onClick={() => setActiveTab('goal')} style={{ padding: '6px 10px', fontSize: '0.85rem' }}>
              <i className="fa-regular fa-circle-dot live-blue-dot"></i> Active Bets
            </button>
            <button className={`nav-btn ${activeTab === 'transactions' ? 'active' : ''}`} onClick={() => setActiveTab('transactions')} style={{ padding: '6px 10px', fontSize: '0.85rem' }}>
              <i className="fa-solid fa-clock-rotate-left"></i> History
            </button>
          </nav>
        </header>

        {/* ADMIN MODAL PANEL */}
        {showAdminModal && (
          <div className="admin-modal-overlay" onClick={() => setShowAdminModal(false)}>
            <div className="admin-modal-content" onClick={(e) => e.stopPropagation()} style={{ background: '#ffffff', padding: '20px', borderRadius: '10px', maxWidth: '600px', width: '90%', margin: '20px auto', maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
                <h3 style={{ margin: 0, color: '#1e293b' }}><i className="fa-solid fa-shield-halved"></i> Admin Control Center</h3>
                <button onClick={() => setShowAdminModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}><i className="fa-solid fa-xmark"></i></button>
              </div>

              {!isAdminLoggedIn ? (
                <form onSubmit={handleAdminLogin}>
                  <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Please enter admin password to manage team fixtures & screenshot history[span_1](start_span)[span_1](end_span). (Default: 1234)</p>
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

                  {/* ADMIN IMPORT SCREENSHOT HISTORY SECTION WITH GREEN SAVE BUTTON */}
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '15px', marginBottom: '15px' }}>
                    <h4 style={{ color: '#1e293b', marginTop: 0, marginBottom: '8px', fontSize: '0.95rem' }}>
                      <i className="fa-solid fa-file-arrow-up"></i> Import Bet Screenshot History[span_2](start_span)[span_2](end_span)
                    </h4>
                    <form onSubmit={handleAdminImportScreenshot}>
                      <div style={{ marginBottom: '10px' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Screenshot Title / Description</label>
                        <input type="text" placeholder="e.g., Winning Bet Slip #1" value={adminScreenshotTitle} onChange={(e) => setAdminScreenshotTitle(e.target.value)} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                      </div>

                      <div style={{ marginBottom: '12px' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Select Screenshot Image File</label>
                        <input type="file" accept="image/*" onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setAdminScreenshotImage(reader.result);
                            };
                            reader.readAsDataURL(file);
                          }
                        }} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#fff' }} />
                      </div>

                      {adminScreenshotImage && (
                        <div style={{ marginBottom: '12px', textAlign: 'center' }}>
                          <img src={adminScreenshotImage} alt="Preview" style={{ maxWidth: '100%', height: '120px', objectFit: 'contain', borderRadius: '4px', border: '1px solid #ccc' }} />
                        </div>
                      )}

                      <button type="submit" style={{ background: '#10b981', color: 'white', border: 'none', padding: '10px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem', width: '100%', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(16, 185, 129, 0.3)' }}>
                        <i className="fa-solid fa-floppy-disk" style={{ marginRight: '6px' }}></i> Save Screenshot to History
                      </button>
                    </form>
                  </div>

                  {/* ADMIN TEAM & FIXTURE EDITOR SECTION */}
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '15px', marginBottom: '15px' }}>
                    <h4 style={{ color: '#1e293b', marginTop: 0, marginBottom: '8px', fontSize: '0.95rem' }}>
                      <i className="fa-solid fa-pen-to-square"></i> Record League Fixture Results
                    </h4>
                    <form onSubmit={handleAdminSaveTeamDetails}>
                      <div style={{ marginBottom: '10px' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Select League</label>
                        <select value={adminEditLeague} onChange={(e) => setAdminEditLeague(e.target.value)} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                          <option value="La Liga">La Liga</option>
                          <option value="EPL">EPL</option>
                          <option value="Bundesliga">Bundesliga</option>
                        </select>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '8px', alignItems: 'center', marginBottom: '12px' }}>
                        <div>
                          <label style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Home Team</label>
                          <select value={adminEditTeamName} onChange={(e) => setAdminEditTeamName(e.target.value)} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                            {leagueTeamsData[adminEditLeague].map(t => (
                              <option key={t.name} value={t.name}>{t.name}</option>
                            ))}
                          </select>
                        </div>
                        <span style={{ fontWeight: 'bold', color: '#ef4444', paddingTop: '15px' }}>VS</span>
                        <div>
                          <label style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Away Team</label>
                          <select value={adminEditAwayTeamName} onChange={(e) => setAdminEditAwayTeamName(e.target.value)} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                            {leagueTeamsData[adminEditLeague].map(t => (
                              <option key={t.name} value={t.name}>{t.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                        <div>
                          <label style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Home Goals (0 - 9)</label>
                          <select value={adminEditHomeGoals} onChange={(e) => setAdminEditHomeGoals(e.target.value)} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                            {[0,1,2,3,4,5,6,7,8,9].map(n => <option key={n} value={n}>{n}</option>)}
                          </select>
                        </div>
                        <div>
                          <label style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Away Goals (0 - 9)</label>
                          <select value={adminEditAwayGoals} onChange={(e) => setAdminEditAwayGoals(e.target.value)} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                            {[0,1,2,3,4,5,6,7,8,9].map(n => <option key={n} value={n}>{n}</option>)}
                          </select>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                        <div>
                          <label style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Home Corners (0 - 30)</label>
                          <select value={adminEditHomeCorners} onChange={(e) => setAdminEditHomeCorners(e.target.value)} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                            {Array.from({length: 31}, (_, i) => i).map(n => <option key={n} value={n}>{n}</option>)}
                          </select>
                        </div>
                        <div>
                          <label style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Away Corners (0 - 30)</label>
                          <select value={adminEditAwayCorners} onChange={(e) => setAdminEditAwayCorners(e.target.value)} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                            {Array.from({length: 31}, (_, i) => i).map(n => <option key={n} value={n}>{n}</option>)}
                          </select>
                        </div>
                      </div>

                      <button type="submit" style={{ background: '#2563eb', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem', width: '100%', fontWeight: 'bold' }}>
                        Save Fixture Record
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

        {/* LIGHTBOX MODAL FOR FULL SCREEN SCREENSHOT VIEW */}
        {lightboxImage && (
          <div className="admin-modal-overlay" onClick={() => setLightboxImage(null)} style={{ background: 'rgba(0,0,0,0.85)', zIndex: 9999 }}>
            <div className="admin-modal-content" onClick={(e) => e.stopPropagation()} style={{ background: 'transparent', boxShadow: 'none', maxWidth: '95vw', maxHeight: '95vh', textAlign: 'center', position: 'relative' }}>
              <button onClick={() => setLightboxImage(null)} style={{ position: 'absolute', top: '-40px', right: '0', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '50%', width: '35px', height: '35px', fontSize: '1.2rem', cursor: 'pointer' }}>
                <i className="fa-solid fa-xmark"></i>
              </button>
              <img src={lightboxImage} alt="Full Screen Screenshot" style={{ maxWidth: '100%', maxHeight: '85vh', objectFit: 'contain', borderRadius: '8px', border: '2px solid #fff' }} />
            </div>
          </div>
        )}

        {/* TEAM DETAIL MODAL WITH ASSETS PIE CHART INTEGRATION */}
        {selectedTeamDetail && (
          <div className="admin-modal-overlay" onClick={() => setSelectedTeamDetail(null)}>
            <div className="admin-modal-content" onClick={(e) => e.stopPropagation()} style={{ background: '#1e293b', color: '#fff', padding: '20px', borderRadius: '12px', maxWidth: '450px', width: '90%', margin: '40px auto', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', marginBottom: '15px' }}>
                <h3 style={{ margin: 0, color: '#38bdf8' }}><i className="fa-solid fa-shield-cat"></i> {selectedTeamDetail.name} Club Analytics</h3>
                <button onClick={() => setSelectedTeamDetail(null)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}><i className="fa-solid fa-xmark"></i></button>
              </div>

              {/* ASSETS PIE CHART DISPLAY */}
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '8px', marginBottom: '15px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '10px', fontWeight: 'bold' }}>Season Distribution & Pie Breakdown</div>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                  <img src="assets/pie.png" alt="Pie Chart Analysis" style={{ width: '130px', height: '130px', objectFit: 'contain' }} />
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '6px' }}>
                  {selectedTeamDetail.recentForm && selectedTeamDetail.recentForm.map((res, idx) => {
                    let bgColor = '#10b981';
                    if (res === 'D') bgColor = '#f59e0b';
                    else if (res === 'L') bgColor = '#ef4444';

                    return (
                      <div key={idx} style={{ 
                        width: '30px', 
                        height: '30px', 
                        borderRadius: '50%', 
                        background: bgColor, 
                        color: '#fff', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        fontWeight: 'bold', 
                        fontSize: '0.75rem' 
                      }}>
                        {res}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Goals Scored / Match</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#10b981', marginTop: '4px' }}>{selectedTeamDetail.goalsScoredAvg}</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Goals Conceded / Match</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#ef4444', marginTop: '4px' }}>{selectedTeamDetail.goalsConcededAvg}</div>
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px', marginBottom: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Average Corners Per Match:</span>
                  <strong style={{ color: '#38bdf8', fontSize: '1.1rem' }}>{selectedTeamDetail.cornersAvg}</strong>
                </div>
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

          {/* TAB 2: NOTEPAD & BET SCREENSHOTS HISTORY VIEW (Replaced h2h/tables with Rov2 and compact dropdown) */}
          {activeTab === 'tables' && (
            <section id="tables-view" className="page-view active" style={{ display: 'block' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
                <h2 style={{ color: '#1e293b', margin: 0, fontSize: '1.2rem' }}><i className="fa-solid fa-folder-open"></i> Notepad & Bet Screenshots</h2>
                
                <div style={{ display: 'flex', gap: '8px' }}>
                  <select 
                    value={selectedNavCategory} 
                    onChange={(e) => setSelectedNavCategory(e.target.value)}
                    style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontWeight: 'bold', background: '#2563eb', color: '#fff', fontSize: '0.8rem' }}
                  >
                    <option value="Rov2">📁 Rov2</option>
                    <option value="screenshots">🖼️ History of Screenshot of My Bets</option>
                  </select>
                </div>
              </div>

              {selectedNavCategory === 'Rov2' && (
                <div style={{ background: '#fff', borderRadius: '10px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <h3 style={{ fontSize: '1rem', color: '#1e293b', margin: 0 }}><i className="fa-solid fa-note-sticky" style={{ color: '#f59e0b', marginRight: '6px' }}></i> Personal Notepad [Rov2]</h3>
                    <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 'bold' }}>Auto-saved to Local Storage</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '12px' }}>Jot down your betting strategies, match analyses, or quick reminders here.</p>
                  
                  <textarea 
                    value={notepadContent}
                    onChange={(e) => {
                      const val = e.target.value;
                      setNotepadContent(val);
                      localStorage.setItem(STORAGE_KEY_NOTEPAD, val);
                    }}
                    placeholder="Type your notes here... (e.g., Analyze Over 2.5 stats for La Liga teams, check team form)"
                    style={{ 
                      width: '100%', 
                      height: '350px', 
                      padding: '12px', 
                      borderRadius: '8px', 
                      border: '1px solid #cbd5e1', 
                      fontFamily: 'monospace', 
                      fontSize: '0.9rem', 
                      lineHeight: '1.5',
                      resize: 'vertical',
                      background: '#f8fafc',
                      color: '#1e293b'
                    }}
                  />
                </div>
              )}

              {selectedNavCategory === 'screenshots' && (
                <div style={{ background: '#fff', borderRadius: '10px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h3 style={{ fontSize: '1rem', color: '#1e293b', margin: 0 }}><i className="fa-solid fa-images" style={{ color: '#3b82f6', marginRight: '6px' }}></i> History of Screenshot of My Bets</h3>
                    <button 
                      onClick={() => setShowAdminModal(true)} 
                      style={{ background: '#2563eb', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}
                    >
                      <i className="fa-solid fa-plus"></i> Import Screenshot in Admin
                    </button>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '15px' }}>Review all imported bet slip screenshots stored in your history archive. Click any screenshot to view full screen.</p>

                  {betScreenshots.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', background: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
                      <i className="fa-solid fa-image" style={{ fontSize: '2.5rem', color: '#94a3b8', marginBottom: '10px' }}></i>
                      <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>No bet screenshots imported yet. Go to the <strong>Admin Panel</strong> to import screenshots.</p>
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '15px' }}>
                      {betScreenshots.map((item) => (
                        <div key={item.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px', overflow: 'hidden' }}>
                          <div 
                            onClick={() => setLightboxImage(item.image)}
                            style={{ height: '180px', overflow: 'hidden', borderRadius: '6px', marginBottom: '8px', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}
                            title="Click to view full screen"
                          >
                            <img src={item.image} alt={item.title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                            <div style={{ position: 'absolute', bottom: '6px', right: '6px', background: 'rgba(0,0,0,0.7)', color: '#fff', padding: '3px 6px', borderRadius: '4px', fontSize: '0.7rem' }}>
                              <i className="fa-solid fa-expand"></i> Full Screen
                            </div>
                          </div>
                          <div style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#1e293b', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Imported: {item.date}</div>
                        </div>
                      ))}
                    </div>
                  )}
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
                        <div className="history-header-toggle">
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
