import React, { useState, useRef } from 'react';
import AnalyzePage from './pages/AnalyzePage';
import InputArea from './components/InputArea';
import './App.css';
import { analyzeFile, analyzeText } from './utils/apiService';
import logo from '../../assets/PolySensor no bg 200px.png';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState('');
  const [isFileLoading, setIsFileLoading] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [error, setError] = useState('');
  const resultRef = useRef(null);
  const [chatHistory, setChatHistory] = useState([]);

  const handleFileAnalyze = async (file) => {
    setSelectedFile(file);
    setAnalysisResult('');
    setError('');
    setIsFileLoading(true);

    try {
      const result = await analyzeFile(file);
      setAnalysisResult(result);
    } catch (err) {
      setError(err.message || 'Failed to analyze content. Please try again.');
      console.error('Analysis error:', err);
    } finally {
      setIsFileLoading(false);
    }
  };

  const handleAnalyzeText = async (text) => {
    setIsFileLoading(true);
    setError('');
    setSelectedFile(null); // Clear file selection when analyzing text

    try {
      const result = await analyzeText(text);
      setAnalysisResult(result);
    } catch (err) {
      setError(err.message || 'Failed to analyze text. Please try again.');
      console.error('Text analysis error:', err);
    } finally {
      setIsFileLoading(false);
    }
  };

  const handleChatMessage = async (message) => {
    setIsChatLoading(true);
    setError('');
    setSelectedFile(null);

    try {
      const response = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: message }),
      });
      if (!response.ok) {
        throw new Error('Chat API request failed');
      }
      const data = await response.json();
      // Append new chats to existing chat history
      setChatHistory((prevChats) => [...prevChats, ...data.chats]);
    } catch (err) {
      setError(err.message || 'Failed to send chat message. Please try again.');
      console.error('Chat error:', err);
    } finally {
      setIsChatLoading(false);
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
          isLoading={isFileLoading}
          resultRef={resultRef}
        />
      </main>

      {chatHistory.length > 0 && (
        <div className="chat-container">
          {chatHistory.map((msg, idx) => (
            <div
              key={idx}
              className={`chat-message ${msg.role === 'user' ? 'user-message' : 'ai-message'}`}
            >
              <div className="chat-bubble">
                <span className="chat-role">{msg.role === 'user' ? 'You' : 'PolySensor'}</span>
                <p className="chat-text">{msg.question || msg.answer}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className={`bottom-controls ${analysisResult ? 'results-view' : ''}`}>
        <InputArea 
          onAnalyze={handleAnalyzeText} 
          onFileAnalyze={handleFileAnalyze} 
          onChatMessage={handleChatMessage}
          isFileLoading={isFileLoading}
          isChatLoading={isChatLoading}
          selectedFile={selectedFile}
        />
        <div className="right-controls">
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
