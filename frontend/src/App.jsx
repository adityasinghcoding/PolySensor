import React from 'react';
import AnalyzePage from './pages/AnalyzePage';
import './App.css';

function App() {
   return (
      <div className='app'>
         <header className='app-header'>
            <h1>PolySensor</h1>
            <p>Upload documents, images, audio, or video for AI analysis</p>
         </header>

         <main className='app-main'>
            <AnalyzePage />
         </main>
      </div>
   );
}

export default App;