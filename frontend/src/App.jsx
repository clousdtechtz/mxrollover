import React, { useState, useEffect, useRef } from 'react';

// Local storage key constants
const STORAGE_KEY_ROLLOVERS = 'mxrollover_local_rollovers';
const STORAGE_KEY_STEPS = 'mxrollover_local_steps';
const STORAGE_KEY_ADMIN_PASS = 'mxrollover_admin_password';
const STORAGE_KEY_TEAM_ANALYSIS = 'mxrollover_team_analysis_logs';
const STORAGE_KEY_LEAGUE_DATA = 'mxrollover_custom_league_teams_data';
const STORAGE_KEY_NOTEPAD = 'mxrollover_local_notepad_content';
const STORAGE_KEY_NOTEPAD_LIST = 'mxrollover_notepad_saved_entries';
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

  // Notepad State (draft)
  const [notepadContent, setNotepadContent] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_NOTEPAD) || '';
  });

  // Saved notes list (each saved note with timestamp)
  const [savedNotes, setSavedNotes] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_NOTEPAD_LIST);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // textarea ref for formatting operations
  const notepadRef = useRef(null);

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
      savedNotes: localStorage.getItem(STORAGE_KEY_NOTEPAD_LIST),
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

  // Save notepad explicitly (green save button) - now saves as a numbered entry with timestamp
  const handleSaveNotepad = () => {
    const trimmed = (notepadContent || '').trim();
    if (!trimmed) {
      alert("Notepad is empty. Type something before saving.");
      return;
    }

    const entry = {
      id: Date.now(),
      content: notepadContent,
      createdAt: new Date().toISOString()
    };

    const updated = [entry, ...savedNotes];
    setSavedNotes(updated);
    localStorage.setItem(STORAGE_KEY_NOTEPAD_LIST, JSON.stringify(updated));

    // keep draft saved as well
    localStorage.setItem(STORAGE_KEY_NOTEPAD, notepadContent);

    alert("Note saved.");
  };

  // Delete saved note (allow user to remove)
  const handleDeleteSavedNote = (id) => {
    if (!window.confirm("Delete saved note?")) return;
    const updated = savedNotes.filter(n => n.id !== id);
    setSavedNotes(updated);
    localStorage.setItem(STORAGE_KEY_NOTEPAD_LIST, JSON.stringify(updated));
  };

  // Formatting helpers - wrap selected text or insert markers
  const applyFormat = (action) => {
    const el = notepadRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const before = notepadContent.substring(0, start);
    const selected = notepadContent.substring(start, end);
    const after = notepadContent.substring(end);

    let newText = notepadContent;
    let newSelStart = start;
    let newSelEnd = end;

    switch (action) {
      case 'bold':
        newText = before + `**${selected || 'bold text'}**` + after;
        newSelStart = start + 2;
        newSelEnd = newSelStart + (selected ? selected.length : 9);
        break;
      case 'italic':
        newText = before + `*${selected || 'italic text'}*` + after;
        newSelStart = start + 1;
        newSelEnd = newSelStart + (selected ? selected.length : 11);
        break;
      case 'underline':
        // Markdown doesn't have underline — use HTML tag
        newText = before + `<u>${selected || 'underlined'}</u>` + after;
        newSelStart = start + 3;
        newSelEnd = newSelStart + (selected ? selected.length : 9);
        break;
      case 'strike':
        newText = before + `~~${selected || 'strike'}~~` + after;
        newSelStart = start + 2;
        newSelEnd = newSelStart + (selected ? selected.length : 6);
        break;
      case 'code':
        newText = before + `\`${selected || 'code'}\`` + after;
        newSelStart = start + 1;
        newSelEnd = newSelStart + (selected ? selected.length : 4);
        break;
      case 'olist':
        // add numbered list before current line(s)
        {
          const linesBefore = notepadContent.substring(0, start).split('\n');
          const lineStartIndex = linesBefore.join('\n').length;
          const lines = notepadContent.substring(lineStartIndex, end).split('\n').map((l, i) => `${i + 1}. ${l || ''}`);
          newText = notepadContent.substring(0, lineStartIndex) + lines.join('\n') + after;
          newSelStart = lineStartIndex;
          newSelEnd = lineStartIndex + lines.join('\n').length;
        }
        break;
      case 'ulist':
        {
          const linesBefore = notepadContent.substring(0, start).split('\n');
          const lineStartIndex = linesBefore.join('\n').length;
          const lines = notepadContent.substring(lineStartIndex, end).split('\n').map(l => `- ${l || ''}`);
          newText = notepadContent.substring(0, lineStartIndex) + lines.join('\n') + after;
          newSelStart = lineStartIndex;
          newSelEnd = lineStartIndex + lines.join('\n').length;
        }
        break;
      default:
        return;
    }

    setNotepadContent(newText);
    // update draft storage immediately
    localStorage.setItem(STORAGE_KEY_NOTEPAD, newText);

    // set selection after DOM update
    requestAnimationFrame(() => {
      if (notepadRef.current) {
        notepadRef.current.focus();
        try {
          notepadRef.current.setSelectionRange(newSelStart, newSelEnd);
        } catch {}
      }
    });
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
        )}

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

        {/* TAB 2: Notepad & Images (only showing the modified notepad area below) */}
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
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '12px' }}>Jot down your betting strategies or quick reminders here. Use the toolbar for basic formatting.</p>

                {/* Formatting toolbar */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                  <button onClick={() => applyFormat('bold')} style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid #ddd', background: '#fff', cursor: 'pointer', fontWeight: '700' }} title="Bold"><b>B</b></button>
                  <button onClick={() => applyFormat('italic')} style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid #ddd', background: '#fff', cursor: 'pointer', fontStyle: 'italic' }} title="Italic"><i>I</i></button>
                  <button onClick={() => applyFormat('underline')} style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid #ddd', background: '#fff', cursor: 'pointer' }} title="Underline"><span style={{ textDecoration: 'underline' }}>U</span></button>
                  <button onClick={() => applyFormat('strike')} style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid #ddd', background: '#fff', cursor: 'pointer' }} title="Strike"><s>S</s></button>
                  <button onClick={() => applyFormat('code')} style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid #ddd', background: '#fff', cursor: 'pointer', fontFamily: 'monospace' }} title="Inline Code">{'</>'}</button>
                  <button onClick={() => applyFormat('olist')} style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid #ddd', background: '#fff', cursor: 'pointer' }} title="Numbered list">1.</button>
                  <button onClick={() => applyFormat('ulist')} style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid #ddd', background: '#fff', cursor: 'pointer' }} title="Bulleted list">•</button>
                </div>

                <textarea
                  ref={notepadRef}
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
                    height: '220px',
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
                <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ color: '#64748b', fontSize: '0.85rem' }}>
                    Draft auto-saved. Press "Save Notepad" to keep as a numbered entry below.
                  </div>
                  <div>
                    <button onClick={handleSaveNotepad} style={{ background: '#10b981', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', marginRight: '8px' }}>
                      Save Notepad
                    </button>
                    <button onClick={() => { setNotepadContent(''); localStorage.setItem(STORAGE_KEY_NOTEPAD, ''); }} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer' }}>
                      Clear
                    </button>
                  </div>
                </div>

                {/* Saved notes list (numbered with date/time) */}
                <div style={{ marginTop: '16px' }}>
                  <h4 style={{ margin: '8px 0 10px 0', color: '#1e293b' }}>Saved Notes</h4>
                  {savedNotes.length === 0 ? (
                    <div style={{ color: '#64748b', fontSize: '0.9rem' }}>No saved notes yet. Saved notes will appear here with numbers and timestamps.</div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {savedNotes.map((note, idx) => {
                        const dt = new Date(note.createdAt);
                        const dateStr = `${dt.toLocaleDateString()} ${dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                        return (
                          <div key={note.id} style={{ background: '#fbfcfd', border: '1px solid #e6eef5', borderRadius: '8px', padding: '10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <div>
                                <div style={{ fontWeight: '800', color: '#1e293b' }}>{idx + 1}. <span style={{ fontWeight: '700' }}>Note</span></div>
                                <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>{dateStr}</div>
                              </div>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={() => { setNotepadContent(note.content); localStorage.setItem(STORAGE_KEY_NOTEPAD, note.content); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '6px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>Load</button>
                                <button onClick={() => handleDeleteSavedNote(note.id)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>Delete</button>
                              </div>
                            </div>
                            <div style={{ marginTop: '8px', whiteSpace: 'pre-wrap', color: '#0f172a', fontSize: '0.95rem' }}>
                              {note.content}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Images tab UI remains unchanged (image modal and admin delete only in admin panel) */}
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
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '12px' }}>All screenshots you import via Admin will appear here. Click a thumbnail to view full size.</p>

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
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {/* rest of app unchanged... (Active Bets, History sections left intact) */}

      </main>
    </div>
  );
}

export default App;