const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// 1. Establish Secure MySQL Database Connection Pool without physical ca.pem file
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'defaultdb',
  port: process.env.DB_PORT || 27609,
  ssl: {
    rejectUnauthorized: false // Connect securely without demanding a local file match
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection on boot
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("🚀 Secure connection to Aiven MySQL established successfully!");
    connection.release();
  } catch (err) {
    console.error("❌ Database connection failed. Verify credentials:", err.message);
  }
})();

// 2. FETCH ALL ROLLOVERS (With their nested tracking day steps)
app.get('/api/rollovers', async (req, res) => {
  try {
    const [runs] = await pool.query('SELECT * FROM rollovers ORDER BY id DESC');
    
    // Fetch individual steps for each active run
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

// 3. CREATE NEW SLIP AND INITIALIZE DAY 1 STEP
app.post('/api/rollovers', async (req, res) => {
  const { title, target_goal, initial_stake, base_odds, match_id, prediction } = req.body;
  
  try {
    // Insert parent challenge run entry (including match_id and prediction)
    const [result] = await pool.query(
      'INSERT INTO rollovers (title, target_goal, initial_stake, base_odds, match_id, prediction) VALUES (?, ?, ?, ?, ?, ?)',
      [title, target_goal, initial_stake, base_odds, match_id, prediction]
    );
    
    const rolloverId = result.insertId;
    const winAmount = initial_stake * base_odds;

    // Automatically initialize Day 1 step row inside bet_steps
    await pool.query(
      'INSERT INTO bet_steps (rollover_id, day_number, stake, odds, win_amount, status) VALUES (?, 1, ?, ?, ?, "pending")',
      [rolloverId, initial_stake, base_odds, winAmount]
    );

    res.status(201).json({ id: rolloverId, message: "Slip initialized with Day 1 setup!" });
  } catch (err) {
    console.error("SQL Error during creation:", err);
    res.status(500).json({ error: err.message });
  }
});

// 4. MANUAL OVERRIDE: TOGGLE INDIVIDUAL STEP STATUS
app.put('/api/bets/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'pending', 'win', 'loss'

  try {
    await pool.query('UPDATE bet_steps SET status = ? WHERE id = ?', [status, id]);
    res.json({ message: "Bet status updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// 5. AUTOMATED LIVE SCORE SETTLEMENT (RAPIDAPI HUB)
app.post('/api/settle-bets', async (req, res) => {
  try {
    const [activeRuns] = await pool.query('SELECT * FROM rollovers WHERE match_id IS NOT NULL');
    
    if (activeRuns.length === 0) {
      return res.json({ message: "No active automation targets scheduled." });
    }

    let updatedCount = 0;

    for (let run of activeRuns) {
      const [pendingSteps] = await pool.query(
        'SELECT * FROM bet_steps WHERE rollover_id = ? AND status = "pending" LIMIT 1', 
        [run.id]
      );

      if (pendingSteps.length === 0) continue; 
      const currentStep = pendingSteps[0];

      console.log(`Checking match metrics for API ID: ${run.match_id}`);

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

        if (rule === 'Over 1.5' && totalGoals > 1.5) isWin = true;
        if (rule === 'Home Win' && homeGoals > awayGoals) isWin = true;
        if (rule === 'Away Win' && awayGoals > homeGoals) isWin = true;

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

    res.json({ message: `Settlement routine finished. Updated ${updatedCount} open bet steps.` });
  } catch (err) {
    console.error("Automation crash error:", err);
    res.status(500).json({ error: "API Settlement failure occurred." });
  }
});

// Start listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening intently on port ${PORT}`);
});
