const express = require('express');
const router = express.Router();
const Vote = require('../models/Vote');
const Anime = require('../models/Anime');

// Submit a vote
router.post('/', async (req, res) => {
  try {
    const { voterId, winnerId, loserId, isDraw } = req.body;
    
    // Create vote record
    const vote = new Vote({
      voterId,
      winner: winnerId,
      loser: loserId,
      isDraw
    });
    
    await vote.save();
    
    // Update anime ratings using Elo-like system
    if (!isDraw) {
      await updateRatings(winnerId, loserId);
    }
    
    res.status(201).json({ message: 'Vote recorded successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Elo-like rating update function
async function updateRatings(winnerId, loserId) {
  const K = 32;
  
  const winner = await Anime.findById(winnerId);
  const loser = await Anime.findById(loserId);
  
  const expectedWinner = 1 / (1 + Math.pow(10, (loser.rating - winner.rating) / 400));
  const expectedLoser = 1 / (1 + Math.pow(10, (winner.rating - loser.rating) / 400));
  
  winner.rating = Math.round(winner.rating + K * (1 - expectedWinner));
  loser.rating = Math.round(loser.rating + K * (0 - expectedLoser));
  
  winner.wins += 1;
  winner.votes += 1;
  loser.losses += 1;
  loser.votes += 1;
  
  await winner.save();
  await loser.save();
}

module.exports = router;