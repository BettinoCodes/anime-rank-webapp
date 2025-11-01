import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import AnimeCard from '../components/AnimeCard'
import AnimeGrid from '../components/AnimeGrid'
import './Home.css'

// Import your custom icons - adjust the paths based on where you place them
import linkedinIcon from '../assets/images/linkedin-icon.png'
import githubIcon from '../assets/images/github-icon.png'

const Home = () => {
  const [animeList, setAnimeList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnime()
  }, [])

  const fetchAnime = async () => {
    try {
      const response = await axios.get('${import.meta.env.VITE_API_URL}/api/anime')
      setAnimeList(response.data.slice(0, 20)) // Show more anime with compact grid
    } catch (error) {
      console.error('Error fetching anime:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>AnimeRank</h1>
        <p>Choose Your Favorite Anime and See How They Rank!</p>
        <Link to="/vote" className="cta-button">
          Start Voting Now
        </Link>
      </div>

      <div className="featured-section">
        <h2>Discover Top 20+ Anime</h2>
        <p>Click on any card to read more about it</p>
        
        <AnimeGrid
          animeList={animeList}
            cardWidth={240} // Slightly wider to accommodate larger image
            cardHeight={360} // Slightly taller to accommodate larger image
            imageWidth={100} // Custom image width
            imageHeight={150} // Custom image height
            gap={20}
            maxColumns={5}
            minColumns={2}
        >
          <AnimeCard />
        </AnimeGrid>

        <div className="leaderboard-button-section">
        <Link to="/leaderboard" className="view-all-button">
          View Full Leaderboard
        </Link>
        </div>
      </div>
      {/* Footer Section with Custom Icons */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-disclaimer">
            <p>This website is for skill showcasing, my passion for anime and educational purposes only.</p>
            <p>All anime data and images are used for demonstration purposes.</p>
          </div>
          <div className="footer-links">
            <a 
              href="https://linkedin.com/in/bettino-gaussaint" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer-link"
            >
              <img 
                src={linkedinIcon} 
                alt="LinkedIn" 
                className="footer-icon"
              />
              LinkedIn
            </a>
            <a 
              href="https://github.com/Bettinocodes" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer-link"
            >
              <img 
                src={githubIcon} 
                alt="GitHub" 
                className="footer-icon"
              />
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
