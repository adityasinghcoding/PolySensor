import React, { useState, useRef } from 'react';
import AnalyzePage from './pages/AnalyzePage';
import FileUploader from './components/FileUploader/FileUploader';
import './App.css';
import { analyzeFile } from './utils/apiService';
import logo from '../../assets/PolySensor no bg 200px.png';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const resultRef = useRef(null);
  const [setHistory, setChatHistory] = useState([]);


  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setAnalysisResult('');
    setError('');
  };

  // sending user message to flask backend using react function
  const Chatting = async (userQuery) => {
    const response = await fetch('/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({query: userQuery}),
  
    });
    // data.chats contains chart history
    const data = await response.json();

    // data.chats to update the state & UI
    setChatHistory(data.chats);
  }

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setError('');

    try {
      const result = await analyzeFile(selectedFile);
      setAnalysisResult(result);
    } catch (err) {
      setError(err.message || 'Failed to analyze content. Please try again.');
      console.error('Analysis error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const exportPDF = async () => {
    if (!analysisResult) return;

    try {
      const response = await fetch('http://localhost:5000/export-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: analysisResult }),
      });

      if (!response.ok) {
        throw new Error('Failed to export PDF from backend');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'analysis-results.pdf');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      console.error('PDF export failed:', err);
      setError('Failed to export PDF. Please try again.');
    }
  };

  return (
    <div className={`app ${selectedFile ? 'shrink' : ''}`}>
      <header className='app-header'>
        <img src={logo} className="app-logo" alt="Custom Logo" />
        <h1>PolySensor</h1>
        <p>AI-Powered Multi-Modal Content Analyzer</p>
      </header>

      <main className='app-main'>
        <AnalyzePage 
          selectedFile={selectedFile} 
          analysisResult={analysisResult} 
          error={error} 
          isLoading={isLoading}
          resultRef={resultRef}
        />
      </main>

      <div>
        {setHistory.map((msg, idx) => (
          <div key={idx}> 
            <b>{msg.role == 'user' ? 'You': 'AI'}:</b>
            {msg.question || msg.answer}
          </div>
        ))}
        {/* add chat input or send button */}
      </div>

      <div className={`bottom-controls ${analysisResult ? 'results-view' : ''}`}>
        <FileUploader
          onFileSelect={handleFileSelect}
          selectedFile={selectedFile}
        />
        <div className="right-controls">
          {selectedFile && (
            <button
              onClick={handleAnalyze}
              disabled={isLoading}
              className="analyze-button"
            >
              {isLoading && <span className="spinner"></span>}
              {isLoading ? 'Analyzing...' : 'Analyze File'}
            </button>
          )}
          {analysisResult && (
            <button
              onClick={exportPDF}
              className="export-button"
              title="Export to PDF"
            >
              Export to PDF
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
