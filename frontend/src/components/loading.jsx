import React from 'react';
import './loading.css';

import loadingGif from '../assets/images/loading.gif'


const Loading = ({ 
  message = "Please wait while my backend wakes up from its free-tier nap! ☕", 
  submessage = "(Render's free tier takes a moment to stretch and yawn)",
  gifUrl = loadingGif // Default fallback
}) => {
  return (
    <div className="loading-container">
      <div className="loading-content">
        <img 
          src={gifUrl} 
          alt="Loading animation" 
          className="loading-gif"
        />
        <p className="loading-text">
          {message}
        </p>
        <p className="loading-subtext">
          {submessage}
        </p>
      </div>
    </div>
  );
};

export default Loading;