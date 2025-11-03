import React, { useState, useEffect } from 'react'
import axios from 'axios'
import VoteAnimeCard from '../components/VoteAnimeCard'
import Loading from '../components/loading'
import './Vote.css'

import votingGif from '../assets/images/voteloading.gif'


const Vote = () => {
  const [animePair, setAnimePair] = useState([])
  const [selectedAnime, setSelectedAnime] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [loading, setLoading] = useState(true)

  // You can adjust these values to change the image size
  const imageWidth = 220; // Change this value as needed
  const imageHeight = 400; // Change this value as needed

  const fetchRandomPair = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/anime/random-pair`)
      setAnimePair(response.data)
      setSelectedAnime(null)
      setShowResult(false)
    } catch (error) {
      console.error('Error fetching anime pair:', error)
    } finally {
      setLoading(false)
    }
  }

  // In your Vote component
const replaceAnime = async (position) => {
  try {
    // Get IDs of both anime in the current pair to exclude them
    const excludedIds = animePair.map(anime => anime._id).join('-');
    
    const newAnime = await fetchRandomAnime(excludedIds);
    if (newAnime) {
      setAnimePair(prevPair => {
        const newPair = [...prevPair]
        // Replace the anime at the specified position
        newPair[position === 'left' ? 0 : 1] = newAnime
        return newPair
      })
      // Reset selection and results when replacing an anime
      setSelectedAnime(null)
      setShowResult(false)
    }
  } catch (error) {
    console.error('Error replacing anime:', error)
  }
}

// Update the fetchRandomAnime function to accept excluded IDs
const fetchRandomAnime = async (excludedIds = '') => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/anime/random/single?exclude=${excludedIds}`)
    return response.data
  } catch (error) {
    console.error('Error fetching random anime:', error)
    return null
  }
}

  useEffect(() => {
    fetchRandomPair()
  }, [])

  const handleVote = async (winnerId) => {
    if (!animePair.length) return
    
    const loserId = animePair.find(anime => anime._id !== winnerId)._id
    setSelectedAnime(winnerId)
    
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/votes`, {
        voterId: 'user-' + Date.now(),
        winnerId,
        loserId,
        isDraw: false
      })
      
      setShowResult(true)
    } catch (error) {
      console.error('Error submitting vote:', error)
    }
  }

  const handleDraw = async () => {
  try {
    await axios.post(`${import.meta.env.VITE_API_URL}/api/votes`, {
      voterId: 'user-' + Date.now(),
      winnerId: animePair[0]._id,
      loserId: animePair[1]._id,
      isDraw: true
    });
    
    setSelectedAnime('draw');
    setShowResult(true);
  } catch (error) {
    console.error('Error submitting draw:', error);
  }
};

  const handleNext = () => {
    fetchRandomPair()
  }

  if (loading) {
    return (
      <Loading 
          gifUrl={votingGif}
          message="Please wait while my backend wakes up from its free-tier nap!"
          submessage="(Render's free tier takes a moment to stretch and yawn)"
        />
    )
  }

  return (
    <div className="vote-container">
      <div className="vote-header">
        <h1>Which Anime is Better?</h1>
        <p>Click on your favorite to cast your vote!</p>
      </div>

      <div className="battle-container">
  {animePair.length === 2 && (
    <>
      <VoteAnimeCard 
        anime={animePair[0]} 
        onVote={() => handleVote(animePair[0]._id)}
        onReplace={replaceAnime}
        isSelected={selectedAnime === animePair[0]._id}
        showResult={showResult}
        position="left"
        imageWidth={imageWidth}
        imageHeight={imageHeight}
        isWinner={showResult && selectedAnime === animePair[0]._id}
        isLoser={showResult && selectedAnime === animePair[1]._id}
        isDraw={showResult && selectedAnime === 'draw'}
        pointsChange={15}
      />
      
      <VoteAnimeCard 
        anime={animePair[1]} 
        onVote={() => handleVote(animePair[1]._id)}
        onReplace={replaceAnime}
        isSelected={selectedAnime === animePair[1]._id}
        showResult={showResult}
        position="right"
        imageWidth={imageWidth}
        imageHeight={imageHeight}
        isWinner={showResult && selectedAnime === animePair[1]._id}
        isLoser={showResult && selectedAnime === animePair[0]._id}
        isDraw={showResult && selectedAnime === 'draw'}
        pointsChange={15}
      />
    </>
  )}
</div>

      <div className="vs-container">
              <div className="battle-controls">
                <button className="skip-btn" onClick={handleNext}>
                  Skip
                </button>
                <button className="draw-btn" onClick={handleDraw}>
                  Draw
                </button>
                {showResult && (
                  <button className="next-btn" onClick={handleNext}>
                    Next
                  </button>
                )}
              </div>
            </div>
    </div>
  )
}

export default Vote