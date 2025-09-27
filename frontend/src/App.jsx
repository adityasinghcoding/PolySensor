import React, { useState } from 'react';
import AnalyzePage from './pages/AnalyzePage';
import './App.css';
import logo from '../../assets/PolySensor no bg 200px.png';

function App() {
  const [fileSelected, setFileSelected] = useState(false);

  // Pass this handler down to AnalyzePage or handle file input here
  const handleFileSelection = () => {
    setFileSelected(true);
  };

  return (
    <div className={`app ${fileSelected ? 'shrink' : ''}`}>
      <header className='app-header'>
        <img src={logo} className="app-logo" alt="Custom Logo" />
        <h1>PolySensor</h1>
        <p>AI-Powered Multi-Modal Content Analyzer</p>
      </header>

      <main className='app-main'>
        <AnalyzePage onFileSelect={handleFileSelection} />
      </main>
    </div>
  );
}

export default App;
