import React, { useState, useEffect } from 'react';

// Local storage key constants
const STORAGE_KEY_ROLLOVERS = 'mxrollover_local_rollovers';
const STORAGE_KEY_STEPS = 'mxrollover_local_steps';
const STORAGE_KEY_ADMIN_PASS = 'mxrollover_admin_password';
const STORAGE_KEY_TEAM_ANALYSIS = 'mxrollover_team_analysis_logs';
const STORAGE_KEY_LEAGUE_DATA = 'mxrollover_custom_league_teams_data';
const STORAGE_KEY_NOTEPAD = 'mxrollover_local_notepad_content';
const STORAGE_KEY_BET_SCREENSHOTS = 'mxrollover_local_bet_screenshots';

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

  // Navigation dropdown category: two options only (.notepad and images)
  const [selectedNavCategory, setSelectedNavCategory] = useState('.notepad');

  // Notepad State
  const [notepadContent, setNotepadContent] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_NOTEPAD) || '';
  });

  // Bet Screenshots History State (images to display in Images tab)
  const [betScreenshots, setBetScreenshots] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_BET_SCREENSHOTS);
    return saved ? JSON.parse(saved) : [];
  });

  // Admin Screenshot Uploader State
  const [adminScreenshotTitle, setAdminScreenshotTitle] = useState('');
  const [adminScreenshotImage, setAdminScreenshotImage] = useState('');

  // Image viewer modal state
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState('');
  const [modalImageTitle, setModalImageTitle] = useState('');

  // Backup download protection states (moved to Settings)
  const [showBackupPrompt, setShowBackupPrompt] = useState(false);
  const [backupPasswordInput, setBackupPasswordInput] = useState('');

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

  // Handle Admin Importing Screenshot History (unchanged)
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

  // Delete screenshot by id (admin only)
  const handleDeleteScreenshot = (id) => {
    if (!isAdminLoggedIn) {
      alert("Admin login required to delete images.");
      return;
    }
    if (!window.confirm("Delete this screenshot permanently?")) return;
    const updated = betScreenshots.filter(s => s.id !== id);
    setBetScreenshots(updated);
    localStorage.setItem(STORAGE_KEY_BET_SCREENSHOTS, JSON.stringify(updated));
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

  const handleConfirmBackupDownload = (e) => {
    e.preventDefault();
    const storedPass = localStorage.getItem(STORAGE_KEY_ADMIN_PASS) || '1234';
    if (backupPasswordInput === storedPass) {
      setShowBackupPrompt(false);
      setBackupPasswordInput('');
      // proceed to download
      handleDownloadBackupZip();
    } else {
      alert("Incorrect admin password. Backup download cancelled.");
    }
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

  // Save notepad explicitly (green save button)
  const handleSaveNotepad = () => {
    localStorage.setItem(STORAGE_KEY_NOTEPAD, notepadContent);
    alert("Notepad saved to local storage.");
  };

  // Open image fullscreen modal
  const openImageModal = (src, title) => {
    setModalImageSrc(src);
    setModalImageTitle(title || '');
    setShowImageModal(true);
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
                  style={{ padding: '6px', fontSize: '0.85rem', borderRadius: '22px' }}
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
                      <i className="fa-solid fa-table"></i> Notepad & Images
                    </a>
                    <a href="#goal" onClick={() => { setActiveTab('goal'); setShowProfileDropdown(false); }}>
                      <i className="fa-regular fa-circle-dot live-blue-dot"></i> Active bets
                    </a>
                    <a href="#transactions" onClick={() => { setActiveTab('transactions'); setShowProfileDropdown(false); }}>
                      <i className="fas fa-history"></i> My bets
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

                          {/* Download backup moved here and password protected */}
                          <div style={{ marginTop: '10px' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '6px' }}>Data Backup</label>
                            {!showBackupPrompt ? (
                              <button onClick={() => setShowBackupPrompt(true)} style={{ background: '#10b981', color: '#fff', border: 'none', padding: '8px 10px', borderRadius: '6px', cursor: 'pointer', fontWeight: '700' }}>
                                Download Data Backup (.json)
                              </button>
                            ) : (
                              <form onSubmit={handleConfirmBackupDownload} style={{ display: 'flex', gap: '8px', marginTop: '8px', alignItems: 'center' }}>
                                <input type="password" placeholder="Admin password" value={backupPasswordInput} onChange={(e) => setBackupPasswordInput(e.target.value)} required style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} />
                                <button type="submit" style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '8px 10px', borderRadius: '6px', cursor: 'pointer', fontWeight: '700' }}>Confirm</button>
                                <button type="button" onClick={() => { setShowBackupPrompt(false); setBackupPasswordInput(''); }} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 10px', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                              </form>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <nav style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            <button
              className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
              style={{ padding: '6px 10px', fontSize: '0.85rem', borderRadius: '8px' }}
            >
              <i className="fas fa-home"></i> Home
            </button>
            <button
              className={`nav-btn ${activeTab === 'tables' ? 'active' : ''}`}
              onClick={() => setActiveTab('tables')}
              style={{ padding: '6px 10px', fontSize: '0.85rem', borderRadius: '8px' }}
            >
              <i className="fa-solid fa-clipboard-list"></i> Notepad & Images
            </button>
            <button
              className={`nav-btn ${activeTab === 'goal' ? 'active' : ''}`}
              onClick={() => setActiveTab('goal')}
              style={{ padding: '6px 10px', fontSize: '0.85rem', borderRadius: '8px' }}
            >
              <i className="fa-regular fa-circle-dot live-blue-dot"></i> Active Bets
            </button>
            <button
              className={`nav-btn ${activeTab === 'transactions' ? 'active' : ''}`}
              onClick={() => setActiveTab('transactions')}
              style={{ padding: '6px 10px', fontSize: '0.85rem', borderRadius: '8px' }}
            >
              <i className="fa-solid fa-clock-rotate-left"></i> History
            </button>
          </nav>
        </header>

        {/* ADMIN MODAL PANEL - simplified: only login, screenshot import, change password, manage bets & images */}
        {showAdminModal && (
          <div className="admin-modal-overlay" onClick={() => setShowAdminModal(false)}>
            <div className="admin-modal-content" onClick={(e) => e.stopPropagation()} style={{ background: '#ffffff', padding: '16px', borderRadius: '8px', maxWidth: '600px', width: '94%', margin: '16px auto', maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
                <h3 style={{ margin: 0, color: '#1e293b' }}><i className="fa-solid fa-shield-halved"></i> Admin Control</h3>
                <button onClick={() => setShowAdminModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.1rem', cursor: 'pointer' }}><i className="fa-solid fa-xmark"></i></button>
              </div>

              {!isAdminLoggedIn ? (
                <form onSubmit={handleAdminLogin}>
                  <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Enter admin password to manage screenshots & challenge runs. (Default: 1234)</p>
                  <div className="input-group" style={{ margin: '12px 0' }}>
                    <label style={{ fontSize: '0.85rem' }}>Admin Password</label>
                    <input type="password" placeholder="Enter password" value={adminPasswordInput} onChange={(e) => setAdminPasswordInput(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} />
                  </div>
                  <button type="submit" style={{ width: '100%', backgroundColor: '#2563eb', color: 'white', padding: '8px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' }}>Login</button>
                </form>
              ) : (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f1f5f9', padding: '8px', borderRadius: '6px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 'bold' }}><i className="fa-solid fa-circle-check"></i> Admin Authenticated</span>
                    <button onClick={() => setIsAdminLoggedIn(false)} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>Logout</button>
                  </div>

                  {/* ADMIN IMPORT SCREENSHOT HISTORY SECTION */}
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', marginBottom: '12px' }}>
                    <h4 style={{ color: '#1e293b', marginTop: 0, marginBottom: '8px', fontSize: '0.95rem' }}>
                      <i className="fa-solid fa-file-arrow-up"></i> Import Screenshot to History
                    </h4>
                    <form onSubmit={handleAdminImportScreenshot}>
                      <div style={{ marginBottom: '8px' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: '600' }}>Screenshot Title</label>
                        <input type="text" placeholder="e.g., Winning Bet Slip #1" value={adminScreenshotTitle} onChange={(e) => setAdminScreenshotTitle(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                      </div>

                      <div style={{ marginBottom: '10px' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: '600' }}>Select Image</label>
                        <input type="file" accept="image/*" onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setAdminScreenshotImage(reader.result);
                            };
                            reader.readAsDataURL(file);
                          }
                        }} style={{ width: '100%', padding: '6px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff' }} />
                      </div>

                      {adminScreenshotImage && (
                        <div style={{ marginBottom: '10px', textAlign: 'center' }}>
                          <img src={adminScreenshotImage} alt="Preview" style={{ maxWidth: '100%', height: '120px', objectFit: 'contain', borderRadius: '6px', border: '1px solid #ccc' }} />
                        </div>
                      )}

                      <button type="submit" style={{ background: '#10b981', color: 'white', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem', width: '100%', fontWeight: '700' }}>
                        Import Screenshot
                      </button>
                    </form>
                  </div>

                  {/* ADMIN: Manage Imported Images (with delete) */}
                  <div style={{ background: '#fff', border: '1px solid #e6eef5', borderRadius: '8px', padding: '12px', marginBottom: '12px' }}>
                    <h4 style={{ marginTop: 0, marginBottom: '8px', color: '#1e293b' }}><i className="fa-solid fa-images"></i> Manage Imported Images</h4>
                    {betScreenshots.length === 0 ? (
                      <p style={{ color: '#64748b', fontSize: '0.9rem' }}>No imported images yet.</p>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px' }}>
                        {betScreenshots.map(item => (
                          <div key={item.id} style={{ position: 'relative', borderRadius: '6px', overflow: 'hidden', border: '1px solid #e2e8f0', background: '#f8fafc' }}>
                            <div style={{ height: '110px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', cursor: 'pointer' }} onClick={() => openImageModal(item.image, item.title)}>
                              <img src={item.image} alt={item.title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                            </div>
                            <div style={{ padding: '8px' }}>
                              <div style={{ fontWeight: '700', fontSize: '0.85rem', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</div>
                              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.date}</div>
                            </div>
                            <button onClick={() => handleDeleteScreenshot(item.id)} style={{ position: 'absolute', right: '6px', top: '6px', background: 'rgba(239,68,68,0.95)', color: '#fff', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem' }}>
                              Delete
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* CHANGE ADMIN PASSWORD - keep available */}
                  <div style={{ marginBottom: '12px' }}>
                    <button onClick={() => setShowChangePassSection(!showChangePassSection)} style={{ background: '#f59e0b', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>
                      <i className="fa-solid fa-key"></i> {showChangePassSection ? "Cancel" : "Change Admin Password"}
                    </button>

                    {showChangePassSection && (
                      <form onSubmit={handleChangeAdminPassword} style={{ marginTop: '10px', padding: '10px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                        <div style={{ marginBottom: '8px' }}>
                          <label style={{ fontSize: '0.8rem' }}>Old Password</label>
                          <input type="password" value={oldPassInput} onChange={(e) => setOldPassInput(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} />
                        </div>
                        <div style={{ marginBottom: '8px' }}>
                          <label style={{ fontSize: '0.8rem' }}>New Password</label>
                          <input type="password" value={newPassInput} onChange={(e) => setNewPassInput(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} />
                        </div>
                        <div style={{ marginBottom: '8px' }}>
                          <label style={{ fontSize: '0.8rem' }}>Confirm New Password</label>
                          <input type="password" value={confirmPassInput} onChange={(e) => setConfirmPassInput(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} />
                        </div>
                        <button type="submit" style={{ background: '#2563eb', color: 'white', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>Save New Password</button>
                      </form>
                    )}
                  </div>

                  {/* Manage active bets status (unchanged) */}
                  <h4 style={{ color: '#1e293b', borderBottom: '1px solid #eee', paddingBottom: '6px' }}>Manage Active Bets Status</h4>
                  {rolloverRuns.length === 0 ? (
                    <p style={{ fontSize: '0.85rem', color: '#64748b' }}>No active runs found in local storage database.</p>
                  ) : (
                    rolloverRuns.map(run => (
                      <div key={run.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '8px', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <strong style={{ fontSize: '0.95rem' }}>{run.title}</strong>
                          <button onClick={() => handleDeleteRolloverRun(run.id)} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '6px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}><i className="fa-solid fa-trash"></i> Delete</button>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: '#555', margin: '6px 0' }}>Market: {run.prediction}</p>

                        <div style={{ marginTop: '8px' }}>
                          {run.steps && run.steps.map(step => (
                            <div key={step.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '8px', borderRadius: '6px', marginBottom: '6px', border: '1px solid #ddd', fontSize: '0.85rem' }}>
                              <span>Day {step.day_number} | Stake: {parseFloat(step.stake).toLocaleString()} TZS</span>
                              <button
                                onClick={() => handleToggleBetStatus(step.id, step.status)}
                                style={{
                                  padding: '6px 8px',
                                  borderRadius: '6px',
                                  border: 'none',
                                  cursor: 'pointer',
                                  fontWeight: '700',
                                  backgroundColor: step.status === 'win' ? '#10b981' : step.status === 'loss' ? '#ef4444' : '#f59e0b',
                                  color: 'white',
                                  fontSize: '0.8rem'
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

        {/* IMAGE FULLSCREEN MODAL */}
        {showImageModal && (
          <div className="image-modal-overlay" onClick={() => setShowImageModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200 }}>
            <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: '95%', maxHeight: '95%', position: 'relative' }}>
              <button onClick={() => setShowImageModal(false)} style={{ position: 'absolute', right: '-10px', top: '-10px', background: '#fff', borderRadius: '50%', border: 'none', padding: '8px', cursor: 'pointer', zIndex: 1300 }}><i className="fa-solid fa-xmark"></i></button>
              <img src={modalImageSrc} alt={modalImageTitle} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '6px' }} />
              {modalImageTitle && <div style={{ marginTop: '8px', color: '#fff', textAlign: 'center' }}>{modalImageTitle}</div>}
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
                  <p className="history-title-paragraph" style={{ fontWeight: '700', fontSize: '0.95rem' }}>
                    <i className="fa-solid fa-square-plus" style={{ color: '#3498db', marginRight: '6px' }}></i> Create Betslip
                  </p>
                  <i className="fas fa-chevron-down toggle-arrow"></i>
                </div>

                <div className="history-content-collapsible" style={{ display: openCreateBetslip ? 'block' : 'none', padding: '12px' }}>
                  <form onSubmit={handleGenerateActiveSlip}>
                    <div className="form-row-base" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <div className="input-group" style={{ minWidth: '140px' }}>
                        <label style={{ fontSize: '0.85rem' }}>Base Stake</label>
                        <input type="number" value={baseStake} onChange={(e) => setBaseStake(e.target.value)} required style={{ padding: '8px', borderRadius: '6px' }} />
                      </div>
                      <div className="input-group" style={{ minWidth: '140px' }}>
                        <label style={{ fontSize: '0.85rem' }}>Total Odds</label>
                        <input type="number" value={accumulatedOdds.toFixed(2)} readOnly style={{ backgroundColor: '#f1f5f9', fontWeight: '700', color: '#2563eb', padding: '8px', borderRadius: '6px' }} />
                      </div>
                      <div className="input-group" style={{ minWidth: '140px' }}>
                        <label style={{ fontSize: '0.85rem' }}>Kick-off</label>
                        <input type="time" value={kickOffTime} onChange={(e) => setKickOffTime(e.target.value)} style={{ padding: '8px', borderRadius: '6px' }} />
                      </div>
                    </div>

                    <div style={{ marginTop: '8px' }}>
                      <label style={{ fontSize: '0.85rem' }}>Prediction</label>
                      <select value={prediction} onChange={(e) => setPrediction(e.target.value)} style={{ padding: '8px', borderRadius: '6px', width: '100%' }}>
                        <option value="Over 1.5">Over 1.5 Goals</option>
                        <option value="Over 2.5">Over 2.5 Goals</option>
                        <option value="Under 3.5">Under 3.5 Goals</option>
                        <option value="Home Win">Home Win (1)</option>
                        <option value="Away Win">Away Win (2)</option>
                        <option value="BTTS Yes">Both Teams to Score: Yes</option>
                      </select>
                    </div>

                    <div className="added-teams-summary" style={{ marginTop: '8px', fontSize: '0.9rem' }}>
                      {stagedMatches.length > 0 ? stagedMatches.join(' | ') : null}
                    </div>

                    <div className="accumulator-input-row" style={{ display: 'flex', gap: '8px', marginTop: '8px', alignItems: 'center' }}>
                      <input type="text" placeholder="Home Team" value={homeTeam} onChange={(e) => setHomeTeam(e.target.value)} style={{ padding: '8px', borderRadius: '6px', flex: 1 }} />
                      <span className="vs-text" style={{ fontWeight: '700' }}>vs</span>
                      <input type="text" placeholder="Away Team" value={awayTeam} onChange={(e) => setAwayTeam(e.target.value)} style={{ padding: '8px', borderRadius: '6px', flex: 1 }} />
                      <input type="number" step="0.01" placeholder="Odds" style={{ width: '90px', padding: '8px', borderRadius: '6px' }} value={matchOdd} onChange={(e) => setMatchOdd(e.target.value)} />
                      <button type="button" onClick={handleAppendMatch} className="append-plus-btn" style={{ padding: '8px', borderRadius: '6px', fontSize: '0.95rem' }}>
                        <i className="fa-solid fa-plus"></i>
                      </button>
                    </div>

                    <button type="submit" className="create-slip-btn" style={{ marginTop: '10px', padding: '10px 14px', borderRadius: '8px', fontSize: '0.95rem' }}>Generate Active Slip</button>
                  </form>
                </div>
              </div>

              {/* ACCORDION 2: FLASHSCORE MOBI */}
              <div className={`history-dropdown-card ${openLiveScore ? 'open' : ''}`} style={{ marginTop: '12px' }}>
                <div className="history-header-toggle" onClick={() => setOpenLiveScore(!openLiveScore)} style={{ backgroundColor: '#f1f5f9' }}>
                  <p className="history-title-paragraph" style={{ fontWeight: '700', fontSize: '0.95rem' }}>
                    <i className="fa-solid fa-clock" style={{ color: '#e74c3c', marginRight: '6px' }}></i> Flashscore Mobile
                  </p>
                  <i className="fas fa-chevron-down toggle-arrow"></i>
                </div>
                <div className="history-content-collapsible" style={{ display: openLiveScore ? 'block' : 'none', padding: '10px' }}>
                  <div className="iframe-display-container">
                    <iframe src="https://flashscore.mobi/" title="Flashscore Web Frame" style={{ width: '100%', height: '420px', border: 'none', borderRadius: '8px' }}></iframe>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* TAB 2: Notepad & Images */}
          {activeTab === 'tables' && (
            <section id="tables-view" className="page-view active" style={{ display: 'block' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                <h2 style={{ color: '#1e293b', margin: 0 }}><i className="fa-solid fa-folder-open"></i> Notepad & Images</h2>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <select
                    value={selectedNavCategory}
                    onChange={(e) => setSelectedNavCategory(e.target.value)}
                    style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: '600', background: '#2563eb', color: '#fff', fontSize: '0.85rem' }}
                  >
                    <option value=".notepad">📁 .notepad</option>
                    <option value="images">🖼️ Images</option>
                  </select>
                </div>
              </div>

              {selectedNavCategory === '.notepad' && (
                <div style={{ background: '#fff', borderRadius: '10px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '1rem', color: '#1e293b', margin: 0 }}><i className="fa-solid fa-note-sticky" style={{ color: '#f59e0b', marginRight: '6px' }}></i> Personal Notepad</h3>
                    <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: '700' }}>Auto-saved</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '12px' }}>Jot down your betting strategies or quick reminders here.</p>

                  <textarea
                    value={notepadContent}
                    onChange={(e) => {
                      const val = e.target.value;
                      setNotepadContent(val);
                      // still autosave for safety
                      localStorage.setItem(STORAGE_KEY_NOTEPAD, val);
                    }}
                    placeholder="Type your notes here..."
                    style={{
                      width: '100%',
                      height: '300px',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontFamily: 'monospace',
                      fontSize: '0.95rem',
                      lineHeight: '1.5',
                      resize: 'vertical',
                      background: '#f8fafc',
                      color: '#1e293b'
                    }}
                  />
                  <div style={{ marginTop: '10px', textAlign: 'right' }}>
                    <button onClick={handleSaveNotepad} style={{ background: '#10b981', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }}>
                      Save Notepad
                    </button>
                  </div>
                </div>
              )}

              {selectedNavCategory === 'images' && (
                <div style={{ background: '#fff', borderRadius: '10px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h3 style={{ fontSize: '1rem', color: '#1e293b', margin: 0 }}><i className="fa-solid fa-images" style={{ color: '#3b82f6', marginRight: '6px' }}></i> Images (Imported from Admin)</h3>
                    <button
                      onClick={() => setShowAdminModal(true)}
                      style={{ background: '#2563eb', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.88rem', fontWeight: '700' }}
                    >
                      <i className="fa-solid fa-plus" style={{ marginRight: '6px' }}></i> Import (Admin)
                    </button>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '12px' }}>All screenshots you import via Admin will appear here. Click a thumbnail to view full size. Admins can delete images.</p>

                  {betScreenshots.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '28px', background: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
                      <i className="fa-solid fa-image" style={{ fontSize: '2rem', color: '#94a3b8', marginBottom: '8px' }}></i>
                      <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0 }}>No images imported yet. Use the Admin panel to add screenshots.</p>
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                      {betScreenshots.map((item) => (
                        <div key={item.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px', overflow: 'hidden', position: 'relative' }}>
                          <div style={{ height: '160px', overflow: 'hidden', borderRadius: '6px', marginBottom: '8px', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={() => openImageModal(item.image, item.title)}>
                            <img src={item.image} alt={item.title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                          </div>
                          <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#1e293b', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</div>
                          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Imported: {item.date}</div>

                          {/* Admin delete overlay (visible when admin logged in) */}
                          {isAdminLoggedIn && (
                            <button onClick={() => handleDeleteScreenshot(item.id)} style={{ position: 'absolute', right: '10px', top: '10px', background: 'rgba(239,68,68,0.95)', color: '#fff', border: 'none', padding: '6px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>
                              Delete
                            </button>
                          )}
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
              <h2 style={{ marginBottom: '12px', color: '#333' }}>Active Bets</h2>
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
                        style={{ borderLeft: '4px solid #00b0ff', marginBottom: '16px', cursor: 'pointer', backgroundColor: isExpanded ? '#e3f2fd' : '#ffffff' }}
                        onClick={() => setExpandedRunId(isExpanded ? null : run.id)}
                      >
                        <div className="history-header-toggle" style={{ display: 'block', padding: '10px' }}>
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
                            <table className="history-data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                              <thead>
                                <tr>
                                  <th style={{ textAlign: 'left', padding: '8px' }}>DAY</th>
                                  <th style={{ textAlign: 'left', padding: '8px' }}>STAKE</th>
                                  <th style={{ textAlign: 'left', padding: '8px' }}>ODD</th>
                                  <th style={{ textAlign: 'left', padding: '8px' }}>WIN</th>
                                  <th style={{ textAlign: 'left', padding: '8px' }}>STATUS</th>
                                </tr>
                              </thead>
                              <tbody>
                                {displaySteps.map((step) => (
                                  <tr key={step.id}>
                                    <td style={{ padding: '8px' }}>Day {step.day_number}</td>
                                    <td style={{ padding: '8px' }}>{parseFloat(step.stake).toLocaleString()} TZS</td>
                                    <td style={{ padding: '8px' }}>@{parseFloat(step.odds).toFixed(2)}</td>
                                    <td style={{ padding: '8px' }}>{parseFloat(step.win_amount).toLocaleString()} TZS</td>
                                    <td style={{ padding: '8px' }}>
                                      <span
                                        style={{
                                          padding: '6px 8px',
                                          borderRadius: '6px',
                                          fontWeight: '700',
                                          display: 'inline-block',
                                          backgroundColor: step.status === 'win' ? '#10b981' : step.status === 'loss' ? '#ef4444' : '#f59e0b',
                                          color: 'white',
                                          fontSize: '0.8rem'
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
              <h2 style={{ marginBottom: '12px', color: '#333' }}>Bets History</h2>
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
                      <div className="history-dropdown-card" key={run.id} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #efefef', marginBottom: '8px' }}>
                        <div className="history-header-toggle" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <p className="history-title-paragraph" style={{ margin: 0 }}>
                            <strong>Challenge Run:</strong> {run.title} (Settled: {settledSteps.length} Days)
                          </p>
                          <span style={{ fontSize: '0.95rem', marginLeft: '6px' }}>
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