import React from 'react';
import './Loading.css';

function Loading() {
  return (
    <div className="loading-container">
      <div className="loading-spinner">
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
      <h2>Digesting the data...</h2>
      <p>This may take a few moments depending on the file size and content.</p>
    </div>
  );
}

export default Loading;
