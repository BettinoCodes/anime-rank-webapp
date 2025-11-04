import React, { useState } from "react";
import "./VoteAnimeCard.css";

import flipIcon from '../assets/images/arrow.png'

const VoteAnimeCard = ({ 
  anime, 
  onVote, 
  onReplace,
  isSelected = false, 
  showResult = false,
  imageWidth = 150,
  imageHeight = 200,
  position,
  isWinner = false,
  isLoser = false,
  isDraw = false
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHoveringButton, setIsHoveringButton] = useState(false);
  const [isHoveringHaventWatched, setIsHoveringHaventWatched] = useState(false);

  const handleFlip = (e) => {
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };

  const handleCardClick = () => {
    if (!showResult && !isFlipped && !isHoveringButton && !isHoveringHaventWatched) {
      onVote(anime._id);
    }
  };

  const handleButtonMouseEnter = () => {
    setIsHoveringButton(true);
  };

  const handleButtonMouseLeave = () => {
    setIsHoveringButton(false);
  };

  const handleHaventWatched = (e) => {
    e.stopPropagation();
    onReplace(position);
  };

  const handleHaventWatchedMouseEnter = () => {
    setIsHoveringHaventWatched(true);
  };

  const handleHaventWatchedMouseLeave = () => {
    setIsHoveringHaventWatched(false);
  };

  const showVoteOverlay = !showResult && !isFlipped && !isHoveringButton && !isHoveringHaventWatched;

  const getResponsiveImageSize = () => {
    return {
      width: '60%',
      height: '35%'
    };
  };

  const imageStyle = getResponsiveImageSize();

  // Determine overlay type and content
  const getOverlayContent = () => {
    if (isWinner) {
      return {
        type: "winner",
        text: "WINNER!",
      };
    } else if (isLoser) {
      return {
        type: "loser",
        text: "DEFEAT",
      };
    } else if (isDraw) {
      return {
        type: "draw",
        text: "DRAW",
      };
    }
    return null;
  };

  const overlayContent = getOverlayContent();

  return (
    <div 
      className={`vote-anime-flip-card ${isSelected ? "selected" : ""} ${showResult ? "show-result" : ""}`}
      onClick={handleCardClick}
    >
      {/* Flip Button */}
      <button 
        className="vote-flip-btn" 
        onClick={handleFlip}
        onMouseEnter={handleButtonMouseEnter}
        onMouseLeave={handleButtonMouseLeave}
      >
        <span className="vote-flip-icon" >{isFlipped ? "↩" : "⤻"}</span>
      </button>

      {/* Vote Overlay */}
      {showVoteOverlay && (
        <div className="vote-overlay">
        </div>
      )}

      {/* Result Overlay */}
      {showResult && overlayContent && (
        <div className={`result-overlay ${overlayContent.type}`}>
          <div className="result-content">
            <div className="result-text">{overlayContent.text}</div>
          </div>
        </div>
      )}

      {/* Flip Card Content */}
      <div className={`vote-anime-flip-card ${isFlipped ? "flipped" : ""}`}>
        <div className="vote-anime-card-inner">
          
          {/* Front of Card */}
          <div className="vote-card-front">
            <div className="vote-card-content">
              <img 
                src={anime.image} 
                alt={anime.title} 
                className="vote-anime-image"
                style={imageStyle}
              />
              <h3 className="vote-anime-tit">{anime.title}</h3>
              <div className="vote-genres">
                {anime.genres.map((genre) => (
                  <span key={genre} className="vote-genre-tag">{genre}</span>
                ))}
              </div>
              {!showResult && !isFlipped && (
                <button 
                  className="vote-havent-watched-btn"
                  onClick={handleHaventWatched}
                  onMouseEnter={handleHaventWatchedMouseEnter}
                  onMouseLeave={handleHaventWatchedMouseLeave}
                >
                  I haven't watched
                </button>
              )}
              <p className="vote-flip-hint">Click flip icon for details</p>
            </div>
          </div>

          {/* Back of Card */}
          <div className="vote-card-back">
            <h3 className="vote-anime-tit">{anime.title}</h3>
            <div className="vote-anime-description-box">
              <p>{anime.description}</p>
            </div>
            <p className="vote-flip-hint">Click flip icon to return</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoteAnimeCard;