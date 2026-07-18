import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE_URL = "https://mxrollover.onrender.com/api";

function App() {
  const [rollovers, setRollovers] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    target_goal: '',
    initial_stake: '',
    base_odds: '',
    match_id: '',
    prediction: 'Over 1.5'
  });
  const [uiMessage, setUiMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/rollovers`);
      setRollovers(response.data);
    } catch (err) {
      console.error("Error pulling dashboard tracks:", err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setUiMessage({ text: '', type: '' });
    
    try {
      const response = await axios.post(`${API_BASE_URL}/rollovers`, formData);
      if (response.data.success || response.status === 201) {
        setUiMessage({ text: "🎉 Betslip created and saved successfully!", type: "success" });
        setFormData({ title: '', target_goal: '', initial_stake: '', base_odds: '', match_id: '', prediction: 'Over 1.5' });
        fetchDashboardData();
      } else {
        setUiMessage({ text: "Failed to process slip parameters.", type: "error" });
      }
    } catch (err) {
      setUiMessage({ text: "Could not establish pipeline to Render server database.", type: "error" });
    }
  };

  const triggerAutoSettlement = async () => {
    setUiMessage({ text: "Polling live RapidAPI fixtures...", type: "info" });
    try {
      const res = await axios.post(`${API_BASE_URL}/settle-bets`);
      setUiMessage({ text: `Settlement processing done! ${res.data.message || ''}`, type: "success" });
      fetchDashboardData();
    } catch (err) {
      setUiMessage({ text: "API automated settlement sequence failed.", type: "error" });
    }
  };

  return (
    <div className="app-container">
      <header className="main-header">
        <h1>Dreams come true</h1>
        <p>✨ Focus on your dream, never give up. ✨</p>
        <button className="settle-btn" onClick={triggerAutoSettlement}>🔄 Settle Bets via API</button>
      </header>

      {uiMessage.text && (
        <div className={`notification-banner ${uiMessage.type}`}>
          {uiMessage.text}
        </div>
      )}

      <main className="dashboard-grid">
        {/* Creation Form */}
        <section className="form-card">
          <h2>➕ Create Betslip Form</h2>
          <form onSubmit={handleFormSubmit}>
            <input type="text" name="title" placeholder="Slip Reference Title (e.g. Real Madrid vs Barca)" value={formData.title} onChange={handleInputChange} required />
            <input type="number" name="initial_stake" placeholder="Base Stake Amount" value={formData.initial_stake} onChange={handleInputChange} required />
            <input type="number" step="0.01" name="base_odds" placeholder="Total Odds Target" value={formData.base_odds} onChange={handleInputChange} required />
            <input type="number" name="target_goal" placeholder="Challenge Days Length Target" value={formData.target_goal} onChange={handleInputChange} required />
            <input type="text" name="match_id" placeholder="RapidAPI Match ID" value={formData.match_id} onChange={handleInputChange} required />
            
            <label>Prediction Rule Criteria:</label>
            <select name="prediction" value={formData.prediction} onChange={handleInputChange}>
              <option value="Over 1.5">Over 1.5 Goals</option>
              <option value="Over 2.5">Over 2.5 Goals</option>
              <option value="Under 3.5">Under 3.5 Goals</option>
              <option value="Under 4.5">Under 4.5 Goals</option>
              <option value="Home Win">Home Team Win (1)</option>
              <option value="Away Win">Away Team Win (2)</option>
              <option value="BTTS Yes">Both Teams to Score: Yes</option>
              <option value="BTTS No">Both Teams to Score: No</option>
              <option value="Double Chance 1X">Double Chance: 1X</option>
              <option value="Double Chance X2">Double Chance: X2</option>
              <option value="Double Chance 12">Double Chance: 12</option>
            </select>

            <button type="submit" className="submit-btn">Generate Active Slip</button>
          </form>
        </section>

        {/* Dynamic Display Area */}
        <section className="active-slips-section">
          <h2>Active Bets Trackers</h2>
          {rollovers.map((run) => (
            <div key={run.id} className="slip-card">
              <h3>Active Run: {run.title || `${run.prediction} Target`}</h3>
              <p className="meta-info">Prediction Target Market: <strong>{run.prediction}</strong> | API Match Reference: <code>{run.match_id}</code></p>
              
              <table className="steps-table">
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
                  {run.steps && run.steps.map((step) => (
                    <tr key={step.id}>
                      <td>Day {step.day_number}</td>
                      <td>{step.stake} TZS</td>
                      <td>@{parseFloat(step.odds).toFixed(2)}</td>
                      <td>{Math.floor(step.win_amount)} TZS</td>
                      <td>
                        <span className={`status-badge ${step.status}`}>
                          {step.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

export default App;
