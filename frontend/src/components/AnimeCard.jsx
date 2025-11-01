import React, { useState } from "react";
import "./AnimeCard.css";

const AnimeCard = ({ anime, imageWidth = 150, imageHeight = 180 }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => setIsFlipped(!isFlipped);

  return (
    <div className={`home-anime-flip-card ${isFlipped ? "flipped" : ""}`} onClick={handleFlip}>
      {/* FIXED: Changed className to match CSS */}
      <div className="home-anime-card-inner">
        
        {/* Front of Card */}
        <div className="home-card-front">
          <img 
            src={anime.image} 
            alt={anime.title} 
            className="home-anime-image"
            style={{
              width: `${imageWidth}px`,
              height: `${imageHeight}px`
            }}
          />
          <div className="home-title-container">
            <h3 className="home-anime-tit">{anime.title}</h3>
          </div>
          <div className="home-genres">
            {anime.genres.map((genre) => (
              <span key={genre} className="home-genre-tag">{genre}</span>
            ))}
          </div>
          {/* FIXED: Changed class name to match CSS */}
          <p className="home-flip-hint">Click for more details</p>
        </div>

        {/* Back of Card */}
        <div className="home-card-back">
          <h3 className="home-anime-tit">{anime.title}</h3>
          <div className="home-anime-description-box">
            <p>{anime.description}</p>
          </div>
          <p className="home-flip-hint">Click to return</p>
        </div>
      </div>
    </div>
  );
};

export default AnimeCard;