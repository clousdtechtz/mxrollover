const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const DB_FILE = path.join(__dirname, 'db.json');

// Helper: Read database from local JSON file
async function readDB() {
  try {
    const data = await fs.readFile(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    // Return default empty structure if file doesn't exist yet
    return { rollovers: [], bet_steps: [] };
  }
}

// Helper: Write database to local JSON file
async function writeDB(data) {
  await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// Initialize local DB file on startup if missing
async function initDB() {
  try {
    await fs.access(DB_FILE);
  } catch {
    await writeDB({ rollovers: [], bet_steps: [] });
  }
}
initDB();

// 1. GET ALL ROLLOVERS (Fetches parent info + all daily steps)
app.get('/api/rollovers', async (req, res) => {
  try {
    const db = await readDB();
    const runs = [...db.rollovers].reverse(); // Equivalent to ORDER BY id DESC
    
    for (let run of runs) {
      const steps = db.bet_steps
        .filter(step => step.rollover_id === run.id)
        .sort((a, b) => a.day_number - b.day_number);
      run.steps = steps;
    }
    
    res.json(runs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// 2. POST NEW SLIP (Creates parent challenge and Day 1 step row)
app.post('/api/rollovers', async (req, res) => {
  const { title, target_goal, initial_stake, base_odds, match_id, prediction } = req.body;
  try {
    const db = await readDB();
    
    const newRolloverId = db.rollovers.length > 0 ? Math.max(...db.rollovers.map(r => r.id)) + 1 : 1;
    
    const newRollover = {
      id: newRolloverId,
      title,
      target_goal,
      initial_stake,
      base_odds,
      match_id,
      prediction
    };
    db.rollovers.push(newRollover);

    const winAmount = initial_stake * base_odds;
    const newStepId = db.bet_steps.length > 0 ? Math.max(...db.bet_steps.map(s => s.id)) + 1 : 1;

    const newStep = {
      id: newStepId,
      rollover_id: newRolloverId,
      day_number: 1,
      stake: initial_stake,
      odds: base_odds,
      win_amount: winAmount,
      status: 'pending'
    };
    db.bet_steps.push(newStep);

    await writeDB(db);

    res.status(201).json({ success: true, id: newRolloverId, message: "Betslip successfully saved!" });
  } catch (err) {
    console.error("Local Storage Insertion Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. PUT UPDATE STEP STATUS (Manual tracking override toggle)
app.put('/api/bets/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const db = await readDB();
    const step = db.bet_steps.find(s => s.id === parseInt(id));
    
    if (!step) {
      return res.status(404).json({ error: "Bet step not found" });
    }
    
    step.status = status;
    await writeDB(db);
    
    res.json({ success: true, message: "Status updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// 4. AUTOMATED LIVE SCORE SETTLEMENT (Expanded Evaluation Engine)
app.post('/api/settle-bets', async (req, res) => {
  try {
    const db = await readDB();
    const activeRuns = db.rollovers.filter(r => r.match_id !== null && r.match_id !== undefined && r.match_id !== '');
    
    if (activeRuns.length === 0) return res.json({ message: "No active targets." });

    let updatedCount = 0;

    for (let run of activeRuns) {
      const pendingSteps = db.bet_steps.filter(s => s.rollover_id === run.id && s.status === 'pending');
      if (pendingSteps.length === 0) continue;
      
      const currentStep = pendingSteps[0];

      const options = {
        method: 'GET',
        url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures',
        params: { id: run.match_id },
        headers: {
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
        }
      };

      const apiResponse = await axios.request(options);
      const fixtureData = apiResponse.data.response;
      if (!fixtureData || fixtureData.length === 0) continue;

      const fixture = fixtureData[0];
      const matchStatus = fixture.fixture.status.short;
      
      if (matchStatus === 'FT') {
        const homeGoals = fixture.goals.home;
        const awayGoals = fixture.goals.away;
        const totalGoals = homeGoals + awayGoals;
        
        let isWin = false;
        const rule = run.prediction;

        // Expanded Rules Engine
        if (rule === 'Over 1.5' && totalGoals > 1.5) isWin = true;
        if (rule === 'Over 2.5' && totalGoals > 2.5) isWin = true;
        if (rule === 'Under 3.5' && totalGoals < 3.5) isWin = true;
        if (rule === 'Under 4.5' && totalGoals < 4.5) isWin = true;
        
        if (rule === 'Home Win' && homeGoals > awayGoals) isWin = true;
        if (rule === 'Away Win' && awayGoals > homeGoals) isWin = true;
        
        if (rule === 'BTTS Yes' && homeGoals > 0 && awayGoals > 0) isWin = true;
        if (rule === 'BTTS No' && (homeGoals === 0 || awayGoals === 0)) isWin = true;
        
        if (rule === 'Double Chance 1X' && homeGoals >= awayGoals) isWin = true;
        if (rule === 'Double Chance X2' && awayGoals >= homeGoals) isWin = true;
        if (rule === 'Double Chance 12' && homeGoals !== awayGoals) isWin = true;

        const finalStatus = isWin ? 'win' : 'loss';
        currentStep.status = finalStatus;
        updatedCount++;

        if (isWin) {
          const nextDay = currentStep.day_number + 1;
          const nextStake = Math.floor(currentStep.win_amount);
          const nextWinAmount = nextStake * run.base_odds;

          const newStepId = db.bet_steps.length > 0 ? Math.max(...db.bet_steps.map(s => s.id)) + 1 : 1;
          const nextStep = {
            id: newStepId,
            rollover_id: run.id,
            day_number: nextDay,
            stake: nextStake,
            odds: run.base_odds,
            win_amount: nextWinAmount,
            status: 'pending'
          };
          db.bet_steps.push(nextStep);
        }
      }
    }
    
    await writeDB(db);
    res.json({ success: true, message: `Updated ${updatedCount} bet steps.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "API settlement routine crashed." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server live on port ${PORT} using local JSON storage`));
