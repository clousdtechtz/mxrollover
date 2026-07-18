const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// 1. MySQL Connection Pool configured for secure SSL (Required by Aiven)
const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 17964,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test DB Connection
db.getConnection()
  .then(conn => {
    console.log("✅ MySQL Database connected successfully with secure SSL.");
    conn.release();
  })
  .catch(err => console.error("❌ Database connection failed:", err));

// 2. FETCH ALL SLIPS
app.get('/api/rollovers', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM rollovers ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. CREATE NEW SLIP
app.post('/api/rollovers', async (req, res) => {
  const { title, target_goal, initial_stake, base_odds } = req.body;
  try {
    const query = `INSERT INTO rollovers (title, target_goal, initial_stake, base_odds, status) VALUES (?, ?, ?, ?, 'pending')`;
    const [result] = await db.query(query, [title, target_goal, initial_stake, base_odds]);
    res.json({ success: true, insertId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. AUTOMATED API SETTLEMENT ROUTE
app.post('/api/settle-bets', async (req, res) => {
  try {
    const [pendingBets] = await db.query("SELECT * FROM rollovers WHERE status = 'pending'");
    
    if (pendingBets.length === 0) {
      return res.json({ message: "No pending bets to settle at this time." });
    }

    let updatedCount = 0;

    for (const bet of pendingBets) {
      if (!bet.match_id) continue; 

      const options = {
        method: 'GET',
        url: 'https://free-api-live-football-data.p.rapidapi.com/football-match-info',
        params: { id: bet.match_id },
        headers: {
          'x-rapidapi-host': 'free-api-live-football-data.p.rapidapi.com',
          'x-rapidapi-key': process.env.RAPIDAPI_KEY
        }
      };

      try {
        const apiRes = await axios.request(options);
        const matchData = apiRes.data;
        
        const statusType = matchData?.status?.type || matchData?.status; 
        
        if (statusType === 'finished' || statusType === 'Finished') {
          const homeScore = matchData?.homeScore?.current || 0;
          const awayScore = matchData?.awayScore?.current || 0;
          const totalGoals = homeScore + awayScore;
          
          let finalStatus = 'pending';

          if (bet.prediction === 'Over 1.5') {
            finalStatus = totalGoals > 1.5 ? 'won' : 'lost';
          } 
          else if (bet.prediction === 'Home Win') {
            finalStatus = homeScore > awayScore ? 'won' : 'lost';
          } else if (bet.prediction === 'Away Win') {
            finalStatus = awayScore > homeScore ? 'won' : 'lost';
          }

          if (finalStatus !== 'pending') {
            await db.query("UPDATE rollovers SET status = ? WHERE id = ?", [finalStatus, bet.id]);
            updatedCount++;
          }
        }
      } catch (apiErr) {
        console.error(`Error processing match ID ${bet.match_id}:`, apiErr.message);
      }
    }

    res.json({ message: `Settlement run completed. Updated ${updatedCount} betslips.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Server Listen
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`🚀 Backend tracking engine online on port ${PORT}`);
});
