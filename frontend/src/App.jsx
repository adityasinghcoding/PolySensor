import React, { useState } from 'react';
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

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setAnalysisResult('');
    setError('');
  };

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

  return (
    <div className={`app ${selectedFile ? 'shrink' : ''}`}>
      <header className='app-header'>
        <img src={logo} className="app-logo" alt="Custom Logo" />
        <h1>PolySensor</h1>
        <p>AI-Powered Multi-Modal Content Analyzer</p>
      </header>

      <main className='app-main'>
        <AnalyzePage selectedFile={selectedFile} analysisResult={analysisResult} error={error} isLoading={isLoading} />
      </main>

      <div className={`bottom-controls ${analysisResult ? 'results-view' : ''}`}>
        <FileUploader
          onFileSelect={handleFileSelect}
          selectedFile={selectedFile}
        />
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
      </div>
    </div>
  );
}

export default App;
