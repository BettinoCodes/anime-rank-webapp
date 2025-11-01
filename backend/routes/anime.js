const express = require("express");
const router = express.Router();
const Anime = require("../models/Anime");
const {
  getRandomPair,
  getRandomSingle,
  vote,
  getLeaderboard
} = require("../controllers/animeController");

router.get("/random-pair", getRandomPair);
router.get("/random/single", getRandomSingle);
router.post("/vote", vote);
router.get("/leaderboard", getLeaderboard);

// 🟢 Get all anime with optional genre filter
router.get("/", async (req, res) => {
  try {
    const { genre } = req.query;
    let query = {};

    if (genre && genre !== "all") {
      query.genres = { $in: [genre] };
    }

    const anime = await Anime.find(query).sort({ rating: -1 });
    res.json(anime);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🟢 Get 2 random anime for voting
router.get("/random-pair", getRandomPair);

// 🟢 Get one random anime (excluding given IDs)
router.get("/random/single", getRandomSingle);

// 🟢 Submit a vote
router.post("/vote", vote);

// 🟢 Get leaderboard
router.get("/leaderboard", getLeaderboard);

// 🟢 Get anime by ID
router.get("/:id", async (req, res) => {
  try {
    const anime = await Anime.findById(req.params.id);
    if (!anime) {
      return res.status(404).json({ message: "Anime not found" });
    }
    res.json(anime);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
