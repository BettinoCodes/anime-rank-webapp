import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './Leaderboard.css'

import Loading from '../components/loading'

import leaderboardGif from '../assets/images/leaderboardloading.gif'


const Leaderboard = () => {
  const [animeList, setAnimeList] = useState([])
  const [filteredAnime, setFilteredAnime] = useState([])
  const [displayAnime, setDisplayAnime] = useState([])
  const [selectedGenre, setSelectedGenre] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showLoadingComponent, setShowLoadingComponent] = useState(false)
  const [error, setError] = useState(null)

  const genres = [
    'All Anime', 'Action', 'Adventure', 'Comedy', 'Dark Fantasy', 'Drama',
    'Martial Arts', 'Mystery', 'Psychological', 'Romance', 'Sci-Fi',
    'Superhero', 'Thriller'
  ]

  useEffect(() => {
    fetchAnime()
  }, [])

  useEffect(() => {
    filterAnime()
  }, [selectedGenre, animeList])

  useEffect(() => {
    if (isSearching) {
      setDisplayAnime(searchResults)
    } else {
      setDisplayAnime(filteredAnime.slice(0, 10)) // Show only top 10
    }
  }, [filteredAnime, searchResults, isSearching])

  const fetchAnime = async () => {
    // Set a timeout to show loading component after 2 seconds
    const loadingTimer = setTimeout(() => {
      setShowLoadingComponent(true)
    }, 3000)

    try {
      setLoading(true)
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/anime`)
      setAnimeList(response.data)
      setError(null) // Clear any previous errors
    } catch (error) {
      console.error('Error fetching anime:', error)
      
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

  const filterAnime = () => {
    let filtered = animeList
    
    if (selectedGenre !== 'all') {
      filtered = filtered.filter(anime => 
        anime.genres.includes(selectedGenre)
      )
    }
    
    setFilteredAnime(filtered)
  }

  const handleGenreChange = (genre) => {
    const genreKey = genre === 'All Anime' ? 'all' : genre
    setSelectedGenre(genreKey)
    setIsSearching(false)
    setSearchQuery('')
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
    
    if (query.trim() === '') {
      setIsSearching(false)
      setSearchResults([])
      return
    }

    setIsSearching(true)
    const results = animeList.filter(anime =>
      anime.title.toLowerCase().includes(query.toLowerCase())
    )
    setSearchResults(results)
  }

  const clearSearch = () => {
    setSearchQuery('')
    setIsSearching(false)
    setSearchResults([])
  }

  const getRankColor = (index) => {
    if (index === 0) return 'gold'
    if (index === 1) return 'silver'
    if (index === 2) return 'bronze'
    return ''
  }

  const getGlobalRank = (anime) => {
    return animeList.findIndex(a => a._id === anime._id) + 1
  }

  // Show error message when backend is down
  if (error === 'backend') {
    return (
      <div className="leaderboard-container">
        <div className="error-container">
          <div className="error-content">
            <h2>Oops! My backend is experiencing issues </h2>
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
      <div className="leaderboard-container">
        <div className="error-container">
          <div className="error-content">
            <h2>Something went wrong! </h2>
            <p>We're having trouble loading the leaderboard data. Please try again later.</p>
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
      <div className="leaderboard-container">
        <Loading 
          gifUrl={leaderboardGif}
          message="Please wait while my backend looks at the sunset!"
          submessage="My backend right now"
        />
      </div>
    )
  }

  // Show minimal loading for fast responses (< 2 seconds)
  if (loading) {
    return (
      <div className="minimal-loading">
        <div className="loading-spinner"></div>
        <p>Loading leaderboard...</p>
      </div>
    )
  }

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <h1>Anime Leaderboard</h1>
        <p>Top-ranked anime based on community votes</p>
      </div>

      <div className="search-section">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search for an anime..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button onClick={clearSearch} className="clear-search">
              Clear
            </button>
          )}
        </div>
        {isSearching && (
          <div className="search-info">
            Showing {searchResults.length} result(s) for "{searchQuery}"
          </div>
        )}
      </div>

      <div className="genre-filters">
        <h3>Filter by Genre</h3>
        <div className="genre-buttons">
          {genres.map(genre => (
            <button
              key={genre}
              className={`genre-btn ${selectedGenre === (genre === 'All Anime' ? 'all' : genre) ? 'active' : ''}`}
              onClick={() => handleGenreChange(genre)}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      <div className="leaderboard-list">
        {displayAnime.length > 0 ? (
          displayAnime.map((anime, index) => {
            const globalRank = getGlobalRank(anime)
            const displayRank = isSearching ? globalRank : index + 1
            
            return (
              <div 
                key={anime._id} 
                className={`leaderboard-item ${getRankColor(isSearching ? globalRank - 1 : index)}`}
              >
                <div className="rank-section">
                  <span className="rank-number">#{displayRank}</span>
                  {!isSearching && index < 3 && <div className="rank-medal"></div>}
                  {isSearching && globalRank <= 3 && <div className="rank-medal"></div>}
                </div>
                
                <div className="anime-info">
                  <div className="anime-image">
                    <img src={anime.image} alt={anime.title} />
                  </div>
                  <div className="anime-content">
                    <h3 className="anime-title">{anime.title}</h3>
                    <div className="anime-genres">
                      {anime.genres.map(genre => (
                        <span key={genre} className="genre-tag">{genre}</span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="anime-stats">
                  <div className="stat">
                    <span className="stat-label">Rating</span>
                    <span className="stat-value rating-value">{anime.rating}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Record</span>
                    <span className="stat-value">{anime.wins}W - {anime.losses}L</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Votes</span>
                    <span className="stat-value">{anime.votes}</span>
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="no-results">
            {isSearching 
              ? `No anime found matching "${searchQuery}"`
              : 'No anime found for the selected genre.'
            }
          </div>
        )}
        
        {!isSearching && filteredAnime.length > 10 && (
          <div className="show-more-note">
            Showing top 10 of {filteredAnime.length} anime. Use search to find specific anime.
          </div>
        )}
      </div>
    </div>
  )
}

export default Leaderboard