import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://mxrollover-backend.onrender.com'; // Your backend URL

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Profile & Theme Customization States
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showSettingsAccordion, setShowSettingsAccordion] = useState(false);
  const [username, setUsername] = useState(() => localStorage.getItem('userProfileUsername') || 'Savings User');
  const [theme, setTheme] = useState(() => localStorage.getItem('userProfileTheme') || 'default');
  const [profilePic, setProfilePic] = useState(() => localStorage.getItem('userProfileImage') || null);
  const [bgImage, setBgImage] = useState(() => {
    const active = localStorage.getItem('useCustomBgActive') === 'true';
    return active ? localStorage.getItem('userProfileCustomBg') : null;
  });

  // Dashboard Dropdown Panels Toggles
  const [openCreateBetslip, setOpenCreateBetslip] = useState(false);
  const [openLiveScore, setOpenLiveScore] = useState(false);
  const [openBetway, setOpenBetway] = useState(false);

  // Coupon Form States
  const [baseStake, setBaseStake] = useState('1000');
  const [kickOffTime, setKickOffTime] = useState('');
  const [stagedMatches, setStagedMatches] = useState([]);
  const [accumulatedOdds, setAccumulatedOdds] = useState(1.00);
  
  // Individual Match Row Builders
  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');
  const [prediction, setPrediction] = useState('');
  const [matchOdd, setMatchOdd] = useState('');

  // Active runs fetched from database
  const [rolloverRuns, setRolloverRuns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/rollovers`);
      setRolloverRuns(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Backend connection offline.", err);
      setLoading(false);
    }
  };

  const handleAppendMatch = (e) => {
    e.preventDefault();
    if (!homeTeam || !awayTeam || !prediction || isNaN(parseFloat(matchOdd))) {
      alert("Please complete the match properties row first.");
      return;
    }
    const currentOddsValue = parseFloat(matchOdd);
    const textSelection = `${homeTeam} vs ${awayTeam} (${prediction} @${currentOddsValue})`;
    setStagedMatches([...stagedMatches, textSelection]);
    setAccumulatedOdds(prev => prev * currentOddsValue);
    setHomeTeam(''); setAwayTeam(''); setPrediction(''); setMatchOdd('');
  };

  const handleGenerateActiveSlip = async (e) => {
    e.preventDefault();
    if (stagedMatches.length === 0) {
      alert("Add matches using the '+' button first.");
      return;
    }
    const d = new Date();
    const currentChallengeDate = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    try {
      await axios.post(`${API_URL}/api/rollovers`, {
        title: `${currentChallengeDate} Run`,
        target_goal: "1M Goal",
        initial_stake: parseFloat(baseStake) || 1000,
        base_odds: parseFloat(accumulatedOdds.toFixed(2))
      });
      setStagedMatches([]); setAccumulatedOdds(1.00); setKickOffTime('');
      fetchData();
      setActiveTab('goal');
      alert(`Slip created successfully!`);
    } catch (err) {
      alert("Database error saving this slip.");
    }
  };

  return (
    <div className={`theme-container theme-${theme}`} style={{ backgroundImage: bgImage ? `url(${bgImage})` : 'none' }}>
      <div className="app-wrapper">
        
        {/* HEADER BLOCK */}
        <header onClick={() => setShowProfileDropdown(false)}>
          <div className="header-content">
            <div className="header-left">
              <h1><i className="fa-regular fa-circle-dot"></i> 𝐃𝐫𝐞𝐚𝐦𝐬 𝐜𝐨𝐦𝐞 𝐭𝐫𝐮𝐞</h1>
              <p style={{ marginTop: '5px', color: 'blue', fontSize: '0.9rem' }}>✦ 𝐹𝑜𝑐𝑢𝑠 𝑜𝑛 𝑦𝑜𝑢𝑟 𝑑𝑟𝑒𝑎𝑚 𝑛𝑒𝑣𝑒𝑟 𝑔𝑖𝑣𝑒 𝑢𝑝. ✧</p>
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
                      <div><strong>{username}</strong></div>
                    </div>
                    <div className="dropdown-divider"></div>
                    <a href="#dashboard" onClick={() => { setActiveTab('dashboard'); setShowProfileDropdown(false); }}><i className="fas fa-tachometer-alt"></i> Dashboard</a>
                    <a href="#goal" onClick={() => { setActiveTab('goal'); setShowProfileDropdown(false); }}><i className="fa-regular fa-circle-dot live-blue-dot"></i> Active bets</a>
                    <a href="#transactions" onClick={() => { setActiveTab('transactions'); setShowProfileDropdown(false); }}><i className="fas fa-history"></i> My bets</a>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <nav>
            <button className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}><i className="fas fa-home"></i> Dashboard</button>
            <button className={`nav-btn ${activeTab === 'goal' ? 'active' : ''}`} onClick={() => setActiveTab('goal')}><i className="fa-regular fa-circle-dot live-blue-dot"></i> Active bets</button>
            <button className={`nav-btn ${activeTab === 'transactions' ? 'active' : ''}`} onClick={() => setActiveTab('transactions')}><i className="fa-solid fa-clock-rotate-left"></i> My bets</button>
          </nav>
        </header>

        {/* MAIN BODY LAYOUT PANEL */}
        <main className="content-container">
          
          {/* TAB 1: DASHBOARD VIEW */}
          {activeTab === 'dashboard' && (
            <section className="page-view active">
              <h2 style={{ marginBottom: '20px', color: '#1e293b' }}>Dashboard Management</h2>
              
              {/* DROPDOWN CARD 1: CREATE BETSLIP */}
              <div className={`history-dropdown-card ${openCreateBetslip ? 'open' : ''}`}>
                <div className="history-header-toggle" onClick={() => setOpenCreateBetslip(!openCreateBetslip)} style={{ background: '#f1f5f9' }}>
                  <p className="history-title-paragraph" style={{ fontWeight: 'bold' }}>
                    <i className="fa-solid fa-square-plus" style={{ color: '#3498db', marginRight: '8px' }}></i> Create Betslip Panel
                  </p>
                  <i className="fas fa-chevron-down toggle-arrow"></i>
                </div>
                <div className="history-content-collapsible" style={{ padding: '15px' }}>
                  <form onSubmit={handleGenerateActiveSlip}>
                    <div className="form-row-base">
                      <div className="input-group"><label>Base Stake</label><input type="number" value={baseStake} onChange={(e) => setBaseStake(e.target.value)} required /></div>
                      <div className="input-group"><label>Total Odds</label><input type="number" value={accumulatedOdds.toFixed(2)} readOnly style={{ backgroundColor: '#f1f5f9', fontWeight: 'bold' }} /></div>
                      <div className="input-group"><label>Kick-off</label><input type="time" value={kickOffTime} onChange={(e) => setKickOffTime(e.target.value)} /></div>
                    </div>
                    <div className="added-teams-summary">{stagedMatches.length === 0 ? "Staging coupon matches empty. Use fields below." : stagedMatches.join(' | ')}</div>
                    <div className="accumulator-input-row">
                      <input type="text" placeholder="Home" value={homeTeam} onChange={(e) => setHomeTeam(e.target.value)} />
                      <span className="vs-text">vs</span>
                      <input type="text" placeholder="Away" value={awayTeam} onChange={(e) => setAwayTeam(e.target.value)} />
                      <input type="text" placeholder="Bet" style={{ width: '90px' }} value={prediction} onChange={(e) => setPrediction(e.target.value)} />
                      <input type="number" step="0.01" placeholder="Odds" style={{ width: '60px' }} value={matchOdd} onChange={(e) => setMatchOdd(e.target.value)} />
                      <button type="button" onClick={handleAppendMatch} className="append-plus-btn"><i className="fa-solid fa-plus"></i></button>
                    </div>
                    <button type="submit" className="create-slip-btn">Generate Active Slip</button>
                  </form>
                </div>
              </div>

              {/* DROPDOWN CARD 2: FLASHSCORE IFRAME */}
              <div className={`history-dropdown-card ${openLiveScore ? 'open' : ''}`} style={{ marginTop: '15px' }}>
                <div className="history-header-toggle" onClick={() => setOpenLiveScore(!openLiveScore)} style={{ background: '#f1f5f9' }}>
                  <p className="history-title-paragraph" style={{ fontWeight: 'bold' }}>
                    <i className="fa-solid fa-clock" style={{ color: '#e21b26', marginRight: '8px' }}></i> Flashscore View Panel
                  </p>
                  <i className="fas fa-chevron-down toggle-arrow"></i>
                </div>
                <div className="history-content-collapsible" style={{ padding: '10px' }}>
                  <div className="iframe-display-container">
                    <iframe src="https://www.flashscore.mobi/" title="Flashscore Live Portal"></iframe>
                  </div>
                </div>
              </div>

              {/* DROPDOWN CARD 3: BETWAY IFRAME */}
              <div className={`history-dropdown-card ${openBetway ? 'open' : ''}`} style={{ marginTop: '15px' }}>
                <div className="history-header-toggle" onClick={() => setOpenBetway(!openBetway)} style={{ background: '#f1f5f9' }}>
                  <p className="history-title-paragraph" style={{ fontWeight: 'bold' }}>
                    <i className="fa-solid fa-bolt" style={{ color: '#8dc63f', marginRight: '8px' }}></i> Betway TZ View Panel
                  </p>
                  <i className="fas fa-chevron-down toggle-arrow"></i>
                </div>
                <div className="history-content-collapsible" style={{ padding: '10px' }}>
                  <div style={{ marginBottom: '10px', textAlign: 'center' }}>
                    <a href="https://en.betway.co.tz/" target="_blank" rel="noreferrer" className="settle-action-btn" style={{ textDecoration: 'none', display: 'inline-block', backgroundColor: '#000' }}>
                      👉 Open Betway App/Site directly
                    </a>
                  </div>
                  <div className="iframe-display-container">
                    <iframe src="https://en.betway.co.tz/" title="Betway Frame Integration"></iframe>
                  </div>
                </div>
              </div>

            </section>
          )}

          {/* TAB 2: ACTIVE BETS */}
          {activeTab === 'goal' && (
            <section className="page-view active">
              <h2>Active Bets</h2>
              <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '10px' }}>No runs currently staged.</p>
            </section>
          )}

          {/* TAB 3: MY BETS */}
          {activeTab === 'transactions' && (
            <section className="page-view active">
              <h2>Bets History</h2>
              <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '10px' }}>No records logged.</p>
            </section>
          )}

        </main>
      </div>
    </div>
  );
}

export default App;
