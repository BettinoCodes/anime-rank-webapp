import React from 'react'
import AnimeCard from './AnimeCard'
import './AnimeGrid.css'

const AnimeGrid = ({ 
  animeList, 
  cardWidth = 220, 
  cardHeight = 340,
  imageWidth = 150,
  imageHeight = 180,
  gap = 20,
  maxColumns = 5,
  minColumns = 2
}) => {
  return (
    <div 
      className="anime-grid"
      style={{
        '--card-width': `${cardWidth}px`,
        '--card-height': `${cardHeight}px`,
        '--gap': `${gap}px`,
        '--max-columns': maxColumns,
        '--min-columns': minColumns
      }}
    >
      {animeList.map((anime) => (
        <div key={anime.id} className="anime-grid-item">
          <AnimeCard 
            anime={anime} 
            imageWidth={imageWidth}
            imageHeight={imageHeight}
          />
        </div>
      ))}
    </div>
  )
}

export default AnimeGrid