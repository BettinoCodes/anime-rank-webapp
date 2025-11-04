import React, { useState, useEffect } from 'react'
import axios from 'axios'
import VoteAnimeCard from '../components/VoteAnimeCard'
import Loading from '../components/loading'
import './Vote.css'

const Vote = () => {
  const [animePair, setAnimePair] = useState([])
  const [selectedAnime, setSelectedAnime] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showLoadingComponent, setShowLoadingComponent] = useState(false)
  const [error, setError] = useState(null)

  // You can adjust these values to change the image size
  const imageWidth = 220; // Change this value as needed
  const imageHeight = 400; // Change this value as needed

  const fetchRandomPair = async () => {
    // Set a timeout to show loading component after 2 seconds
    const loadingTimer = setTimeout(() => {
      setShowLoadingComponent(true)
    }, 3000)

    try {
      setLoading(true)
      setError(null) // Clear any previous errors
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/anime/random-pair`)
      setAnimePair(response.data)
      setSelectedAnime(null)
      setShowResult(false)
    } catch (error) {
      console.error('Error fetching anime pair:', error)
      
      // Check if it's a connection refused error
      if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
        setError('backend')
      } else {
        setError('general')
      }
    } finally {
      clearTimeout(loadingTimer) // Clear the timer if request completes
      setLoading(false)
      setShowLoadingComponent(false) // Hide loading component
    }
  }

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
      // Show error but still display the result UI
      setShowResult(true)
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
      // Show error but still display the result UI
      setSelectedAnime('draw');
      setShowResult(true);
    }
  };

  const handleNext = () => {
    fetchRandomPair()
  }

  // Show error message when backend is down
  if (error === 'backend') {
    return (
      <div className="vote-container">
        <div className="error-container">
          <div className="error-content">
            <h2>Oops! My backend is experiencing issues</h2>
            <p>It looks like my backend service is currently unavailable. This usually happens when:</p>
            <ul>
              <li>Render's free tier is spinning up the server</li>
              <li>There's a temporary connection issue</li>
              <li>The backend is restarting</li>
            </ul>
            <p>Please try refreshing the page in a moment!</p>
            <button onClick={() => window.location.reload()} className="cta-button">
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Show general error message for other errors
  if (error === 'general') {
    return (
      <div className="vote-container">
        <div className="error-container">
          <div className="error-content">
            <h2>Something went wrong! </h2>
            <p>We're having trouble loading the voting data. Please try again later.</p>
            <button onClick={() => window.location.reload()} className="cta-button">
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Show loading component only if loading takes more than 2 seconds
  if (loading && showLoadingComponent) {
    return (
      <div className="vote-container">
        <Loading 
          message="Please wait while my backend wakes up from its free-tier nap!"
          submessage="(Render's free tier takes a moment to stretch and yawn)"
        />
      </div>
    )
  }

  // Show minimal loading for fast responses (< 2 seconds)
  if (loading) {
    return (
      <div className="minimal-loading">
        <div className="loading-spinner"></div>
        <p>Loading anime battle...</p>
      </div>
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