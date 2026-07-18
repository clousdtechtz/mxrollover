const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// 1. Database Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'defaultdb',
  port: process.env.DB_PORT || 27609,
  ssl: { rejectUnauthorized: false },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 2. GET ALL ROLLOVERS (Fetches parent info + all daily steps)
app.get('/api/rollovers', async (req, res) => {
  try {
    const [runs] = await pool.query('SELECT * FROM rollovers ORDER BY id DESC');
    for (let run of runs) {
      const [steps] = await pool.query('SELECT * FROM bet_steps WHERE rollover_id = ? ORDER BY day_number ASC', [run.id]);
      run.steps = steps;
    }
    res.json(runs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// 3. POST NEW SLIP (Creates parent challenge and Day 1 step row)
app.post('/api/rollovers', async (req, res) => {
  const { title, target_goal, initial_stake, base_odds, match_id, prediction } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO rollovers (title, target_goal, initial_stake, base_odds, match_id, prediction) VALUES (?, ?, ?, ?, ?, ?)',
      [title, target_goal, initial_stake, base_odds, match_id, prediction]
    );
    
    const rolloverId = result.insertId;
    const winAmount = initial_stake * base_odds;

    await pool.query(
      'INSERT INTO bet_steps (rollover_id, day_number, stake, odds, win_amount, status) VALUES (?, 1, ?, ?, ?, "pending")',
      [rolloverId, initial_stake, base_odds, winAmount]
    );

    res.status(201).json({ success: true, id: rolloverId, message: "Betslip successfully saved!" });
  } catch (err) {
    console.error("SQL Insertion Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. PUT UPDATE STEP STATUS (Manual tracking override toggle)
app.put('/api/bets/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await pool.query('UPDATE bet_steps SET status = ? WHERE id = ?', [status, id]);
    res.json({ success: true, message: "Status updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// 5. AUTOMATED LIVE SCORE SETTLEMENT (Expanded Evaluation Engine)
app.post('/api/settle-bets', async (req, res) => {
  try {
    const [activeRuns] = await pool.query('SELECT * FROM rollovers WHERE match_id IS NOT NULL');
    if (activeRuns.length === 0) return res.json({ message: "No active targets." });

    let updatedCount = 0;

    for (let run of activeRuns) {
      const [pendingSteps] = await pool.query(
        'SELECT * FROM bet_steps WHERE rollover_id = ? AND status = "pending" LIMIT 1', 
        [run.id]
      );

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
        await pool.query('UPDATE bet_steps SET status = ? WHERE id = ?', [finalStatus, currentStep.id]);
        updatedCount++;

        if (isWin) {
          const nextDay = currentStep.day_number + 1;
          const nextStake = Math.floor(currentStep.win_amount);
          const nextWinAmount = nextStake * run.base_odds;

          await pool.query(
            'INSERT INTO bet_steps (rollover_id, day_number, stake, odds, win_amount, status) VALUES (?, ?, ?, ?, ?, "pending")',
            [run.id, nextDay, nextStake, run.base_odds, nextWinAmount]
          );
        }
      }
    }
    res.json({ success: true, message: `Updated ${updatedCount} bet steps.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "API settlement routine crashed." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server live on port ${PORT}`));
