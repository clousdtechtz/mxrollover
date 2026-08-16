import React, { useState, useEffect } from 'react';

// Local storage storage key constants
const STORAGE_KEY_ROLLOVERS = 'mxrollover_local_rollovers';
const STORAGE_KEY_STEPS = 'mxrollover_local_steps';
const STORAGE_KEY_ADMIN_PASS = 'mxrollover_admin_password';

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
    const active = localStorage.getItem('useCustomBgActive'] === 'true';
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

  // Admin Password Update Handler
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

  // Admin Action: Delete Challenge / Slip
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

  // Status Toggling restricted only inside Admin Panel now
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

      // Auto-generate next day challenge step if marked win
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
                𝐃𝐫𝐞𝐚𝐦𝐬 𝐜𝐨𝐦𝐞 𝐭𝐫𝐮𝐞
              </h1>
              <p style={{ marginTop: '5px', color: 'blue', opacity: 1, fontSize: '0.9rem' }}>
                ✦ 𝐹𝑜𝑐𝑢𝑠 𝑜𝑛 𝑦𝑜𝑢𝑟 𝑑𝑟𝑒𝑎𝑚 𝑛𝑒𝑣𝑒𝑟 𝑔𝑖𝑣𝑒 𝑢𝑝. ✧
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
                        <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>Member</div>
                      </div>
                    </div>
                    
                    <div className="dropdown-divider"></div>
                    
                    <a href="#dashboard" onClick={() => { setActiveTab('dashboard'); setShowProfileDropdown(false); }}>
                      <i className="fas fa-tachometer-alt"></i> Dashboard
                    </a>
                    <a href="#goal" onClick={() => { setActiveTab('goal'); setShowProfileDropdown(false); }}>
                      <i className="fa-regular fa-circle-dot live-blue-dot"></i> Active bets
                    </a>
                    <a href="#transactions" onClick={() => { setActiveTab('transactions'); setShowProfileDropdown(false); }}>
                      <i className="fas fa-history"></i> My bets
                    </a>
                    
                    {/* ADMIN PANEL ENTRY TRIGGER */}
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
              <i className="fas fa-home"></i> Dashboard
            </button>
            <button className={`nav-btn ${activeTab === 'goal' ? 'active' : ''}`} onClick={() => setActiveTab('goal')}>
              <i className="fa-regular fa-circle-dot live-blue-dot"></i> Active bets
            </button>
            <button className={`nav-btn ${activeTab === 'transactions' ? 'active' : ''}`} onClick={() => setActiveTab('transactions')}>
              <i className="fa-solid fa-clock-rotate-left"></i> My bets
            </button>
          </nav>
        </header>

        {/* ADMIN MODAL PANEL CONTAINER */}
        {showAdminModal && (
          <div className="admin-modal-overlay" onClick={() => setShowAdminModal(false)}>
            <div className="admin-modal-content" onClick={(e) => e.stopPropagation()} style={{ background: '#ffffff', padding: '20px', borderRadius: '10px', maxWidth: '500px', width: '90%', margin: '50px auto', maxHeight: '85vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
                <h3 style={{ margin: 0, color: '#1e293b' }}><i className="fa-solid fa-shield-halved"></i> Admin Control Center</h3>
                <button onClick={() => setShowAdminModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}><i className="fa-solid fa-xmark"></i></button>
              </div>

              {!isAdminLoggedIn ? (
                <form onSubmit={handleAdminLogin}>
                  <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Please enter admin password to manage bet statuses and settings. (Default: 1234)</p>
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

                  <h4 style={{ color: '#1e293b', borderBottom: '1px solid #eee', paddingBottom: '6px' }}>Manage Active Bets Status & Records</h4>
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

        {/* MAIN BODY CONTENT SECTIONS */}
        <main className="content-container">
          
          {/* TAB 1: Dashboard View */}
          {activeTab === 'dashboard' && (
            <section id="dashboard-view" className="page-view active" style={{ display: 'block' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ color: '#1e293b' }}>Dashboard Management</h2>
              </div>

              {/* ACCORDION DROPDOWN 1: CREATE BETSLIP */}
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
                          <option value="Under 4.5">Under 4.5 Goals</option>
                          <option value="Home Win">Home Win (1)</option>
                          <option value="Away Win">Away Win (2)</option>
                          <option value="BTTS Yes">Both Teams to Score: Yes</option>
                          <option value="BTTS No">Both Teams to Score: No</option>
                          <option value="Double Chance 1X">Double Chance: 1X</option>
                          <option value="Double Chance X2">Double Chance: X2</option>
                          <option value="Double Chance 12">Double Chance: 12</option>
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

              {/* ACCORDION DROPDOWN 2: FLASHSCORE MOBI */}
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

              {/* Manual Settlement Block */}
              <div className="creator-card" style={{ marginTop: '20px' }}>
                <h3><i className="fa-solid fa-gavel"></i> Open Slip Settlement</h3>
                <div id="dashboard-active-settlement">
                  {rolloverRuns.length === 0 ? (
                    <p style={{ color: '#64748b', fontSize: '0.8rem', textAlign: 'center', padding: '10px' }}>No open un-settled bets slips currently found.</p>
                  ) : (
                    rolloverRuns.slice(0, 1).map(run => (
                      <div key={run.id} className="settlement-block">
                        <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#1e293b' }}>Active Rollover Challenge</div>
                        <div style={{ fontSize: '0.8rem', margin: '6px 0', color: '#475569', lineHeight: 1.3 }}>{run.title}</div>
                        <button className="settle-action-btn" onClick={() => setActiveTab('goal')}>Settle Day Steps</button>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </section>
          )}

          {/* TAB 2: Active Bets */}
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
                        style={{ 
                          borderLeft: '4px solid #00b0ff', 
                          marginBottom: '20px',
                          cursor: 'pointer',
                          backgroundColor: isExpanded ? '#e3f2fd' : '#ffffff' 
                        }}
                        onClick={() => setExpandedRunId(isExpanded ? null : run.id)}
                      >
                        <div className="history-header-toggle" style={{ display: 'block', padding: '12px' }}>
                          <p className="history-title-paragraph" style={{ margin: 0 }}>
                            <strong>Active Run:</strong> {run.title}
                          </p>
                          <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#555' }}>
                            Market: {run.prediction} {run.match_id ? `| Match ID: ${run.match_id}` : ''}
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
                                      {/* Status tag view-only here: non-editable without Admin Panel authentication */}
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
                          <p style={{ fontSize: '0.75rem', color: '#888', marginTop: '8px', textAlign: 'center' }}>* Note: Bet statuses are locked and can only be modified via the Admin Panel in your Profile menu.</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </section>
          )}

          {/* TAB 3: My Bets (History Archive) */}
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
                    if (settledSteps.some(s => s.status === 'loss')) {
                      statusIcon = '❌';
                    } else if (settledSteps.length > 0 && settledSteps.every(s => s.status === 'win')) {
                      statusIcon = '✅';
                    }

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
