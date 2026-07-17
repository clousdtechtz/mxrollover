import React, { useState, useEffect } from 'react';
import './index.css'; // Adjust if using App.css based on your project configuration

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [slips, setSlips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [settleMessage, setSettleMessage] = useState('');

  // Form State for creating a new tracker slip
  const [formData, setFormData] = useState({
    title: '',
    target_goal: '',
    initial_stake: '',
    base_odds: '',
    match_id: '',
    prediction: 'Over 1.5'
  });

  // Your live backend service hosted on Render
  const API_BASE_URL = 'https://mxrollover.onrender.com';

  // Fetch slips from database
  const fetchSlips = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/rollovers`);
      const data = await res.json();
      setSlips(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading slips:", err);
    }
  };

  useEffect(() => {
    fetchSlips();
  }, []);

  // Handle Form Inputs
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit New Bet Slip
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/rollovers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setFormData({ title: '', target_goal: '', initial_stake: '', base_odds: '', match_id: '', prediction: 'Over 1.5' });
        fetchSlips();
      }
    } catch (err) {
      console.error("Error creating slip:", err);
    }
  };

  // Trigger Backend API Automation to Check Scores
  const handleSettleBets = async () => {
    setLoading(true);
    setSettleMessage('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/settle-bets`, { method: 'POST' });
      const data = await res.json();
      setSettleMessage(data.message || 'Settlement processed successfully.');
      fetchSlips(); // Refresh UI list with updated win/loss states
    } catch (err) {
      setSettleMessage('Failed to connect to automation server.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* HEADER CONTROLS */}
      <header className="app-header">
        <h1>MXROLLOVER Tracker</h1>
        <div className="header-actions">
          <button 
            className="api-settle-btn" 
            onClick={handleSettleBets} 
            disabled={loading}
          >
            {loading ? 'Checking Live Scores...' : '🔄 Settle Bets via API'}
          </button>
          
          <select value={activeTab} onChange={(e) => setActiveTab(e.target.value)} className="nav-dropdown">
            <option value="dashboard">📊 Dashboard View</option>
            <option value="flashscore">⚽ Open Flashscore</option>
            <option value="betway">🎰 Open Betway Tz</option>
          </select>
        </div>
      </header>

      {settleMessage && (
        <div className="status-banner">
          <p>{settleMessage}</p>
          <button onClick={() => setSettleMessage('')}>×</button>
        </div>
      )}

      {/* RENDER ACTIVE TAB VIEW */}
      <main className="content-area">
        {activeTab === 'dashboard' && (
          <div className="dashboard-grid">
            
            {/* Left Side: Create Bet Entry */}
            <section className="form-card">
              <h2>Create New Entry</h2>
              <form onSubmit={handleFormSubmit}>
                <div className="input-group">
                  <label>Title / Identifier</label>
                  <input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g., Day 1 - Game 1" required />
                </div>
                <div className="input-row">
                  <div className="input-group">
                    <label>Target Goal ($)</label>
                    <input type="number" step="0.01" name="target_goal" value={formData.target_goal} onChange={handleInputChange} required />
                  </div>
                  <div className="input-group">
                    <label>Stake ($)</label>
                    <input type="number" step="0.01" name="initial_stake" value={formData.initial_stake} onChange={handleInputChange} required />
                  </div>
                </div>
                <div className="input-row">
                  <div className="input-group">
                    <label>Base Odds</label>
                    <input type="number" step="0.01" name="base_odds" value={formData.base_odds} onChange={handleInputChange} required />
                  </div>
                  <div className="input-group">
                    <label>Prediction Type</label>
                    <select name="prediction" value={formData.prediction} onChange={handleInputChange}>
                      <option value="Over 1.5">Over 1.5 Goals</option>
                      <option value="Home Win">Home Win (1)</option>
                      <option value="Away Win">Away Win (2)</option>
                    </select>
                  </div>
                </div>
                <div className="input-group">
                  <label>RapidAPI Match ID (Optional Automation)</label>
                  <input type="text" name="match_id" value={formData.match_id} onChange={handleInputChange} placeholder="e.g., 12389401" />
                  <small>Leave blank if you want to track status manually.</small>
                </div>
                <button type="submit" className="submit-btn">Save to Tracker</button>
              </form>
            </section>

            {/* Right Side: Roll List */}
            <section className="list-card">
              <h2>Active & Completed Slips</h2>
              <div className="slips-container">
                {slips.length === 0 ? (
                  <p className="empty-msg">No entries saved yet.</p>
                ) : (
                  slips.map((slip) => (
                    <div key={slip.id} className={`slip-item ${slip.status}`}>
                      <div className="slip-info">
                        <h3>{slip.title}</h3>
                        <p>Stake: <strong>${slip.initial_stake}</strong> @ {slip.base_odds} odds</p>
                        <p>Target: <strong>${slip.target_goal}</strong> | Rule: {slip.prediction}</p>
                        {slip.match_id && <span className="badge-id">API ID: {slip.match_id}</span>}
                      </div>
                      <div className="slip-status">
                        {slip.status === 'won' && <span className="icon-won">✅ Won</span>}
                        {slip.status === 'lost' && <span className="icon-lost">❌ Lost</span>}
                        {slip.status === 'pending' && <span className="icon-pending">⏳ Pending</span>}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

          </div>
        )}

        {/* Embedded External Views */}
        {activeTab === 'flashscore' && (
          <div className="iframe-container">
            <iframe src="https://flashscore.mobi/" title="Flashscore Live" className="embedded-frame" />
          </div>
        )}

        {activeTab === 'betway' && (
          <div className="iframe-container fallback-view">
            <div className="iframe-fallback-card">
              <h3>Betway Tanzania</h3>
              <p>Due to safety precautions, Betway restricts embedding interfaces directly.</p>
              <a href="https://en.betway.co.tz/" target="_blank" rel="noopener noreferrer" className="external-link-btn">
                Launch Betway Tanzania 🚀
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
