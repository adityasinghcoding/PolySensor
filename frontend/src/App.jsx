import React from 'react';
import AnalyzePage from './pages/AnalyzePage';
import './App.css';
import logo from '../../assets/PolySensor no bg 200px.png';

function App() {
   return (
      <div className='app'>
         <header className='app-header'>
            <img src={logo} className="app-logo" alt="Custom Logo" /> {/* Add the img tag here */}
            <h1>PolySensor</h1>
            <p>AI-Powered Multi-Modal Content Analyzer</p>
         </header>

         <main className='app-main'>
            <AnalyzePage />
         </main>
      </div>
   );
}

export default App;