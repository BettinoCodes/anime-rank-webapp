import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

// Import your PNG images
import homeIcon from '../assets/images/home.png'
import swordIcon from '../assets/images/sword.png'
import trophyIcon from '../assets/images/trophy.png'

const Navbar = () => {
  const location = useLocation()
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          AnimeRank
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link 
              to="/" 
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
              title="Home"
            >
              <img 
                src={homeIcon} 
                alt="Home" 
                className="nav-icon"
              />
              {!isMobile && "Home"}
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/vote" 
              className={`nav-link ${location.pathname === '/vote' ? 'active' : ''}`}
              title="Vote"
            >
              <img 
                src={swordIcon} 
                alt="Vote" 
                className="nav-icon"
              />
              {!isMobile && "Vote"}
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/leaderboard" 
              className={`nav-link ${location.pathname === '/leaderboard' ? 'active' : ''}`}
              title="Leaderboard"
            >
              <img 
                src={trophyIcon} 
                alt="Leaderboard" 
                className="nav-icon"
              />
              {!isMobile && "Leaderboard"}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar