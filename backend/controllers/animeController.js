const mongoose = require("mongoose"); // ✅ Add this line
const Anime = require("../models/Anime");

// Calculate Elo Rating
function calculateElo(winnerPoints, loserPoints) {
  const K = 32;
  const expectedWin = 1 / (1 + Math.pow(10, (loserPoints - winnerPoints) / 400));
  const expectedLose = 1 / (1 + Math.pow(10, (winnerPoints - loserPoints) / 400));

  return {
    winnerNew: Math.round(winnerPoints + K * (1 - expectedWin)),
    loserNew: Math.round(loserPoints + K * (0 - expectedLose))
  };
}

// Get 2 random anime for voting
exports.getRandomPair = async (req, res) => {
  try {
    const animes = await Anime.aggregate([{ $sample: { size: 2 } }]);
    res.json(animes);
  } catch (error) {
    console.error("Error getting random pair:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a single random anime excluding given IDs
exports.getRandomSingle = async (req, res) => {
  try {
    const excludeParam = req.query.exclude || "";
    const excludedIds = excludeParam.split("-").filter(Boolean);

    // ✅ Now mongoose is defined and we can use ObjectId properly
    const anime = await Anime.aggregate([
      {
        $match: {
          _id: { $nin: excludedIds.map(id => new mongoose.Types.ObjectId(id)) }
        }
      },
      { $sample: { size: 1 } }
    ]);

    if (!anime.length) return res.status(404).json({ message: "No anime found" });

    res.json(anime[0]);
  } catch (error) {
    console.error("Error fetching random single:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Vote route (update ratings and stats)
exports.vote = async (req, res) => {
  try {
    const { winnerId, loserId } = req.body;
    const winner = await Anime.findById(winnerId);
    const loser = await Anime.findById(loserId);

    if (!winner || !loser) return res.status(404).json({ message: "Anime not found" });

    const { winnerNew, loserNew } = calculateElo(winner.rating, loser.rating);
    winner.rating = winnerNew;
    loser.rating = loserNew;

    winner.wins += 1;
    loser.losses += 1;
    winner.votes += 1;
    loser.votes += 1;

    await winner.save();
    await loser.save();

    res.json({ message: "Vote recorded", winner, loser });
  } catch (error) {
    console.error("Error recording vote:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get leaderboard (sorted by rating)
exports.getLeaderboard = async (req, res) => {
  try {
    const genre = req.query.genre;
    const query = genre ? { genres: genre } : {};
    const leaderboard = await Anime.find(query).sort({ rating: -1 });
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
