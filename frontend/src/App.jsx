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
  const [exportCount, setExportCount] = useState(0);

  const handleFileAnalyze = async (file) => {
    if (!file) {
      setSelectedFile(null);
      setAnalysisResult('');
      setError('');
      return;
    }
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

    setError(''); // Clear any previous errors before attempting export

    try {
      const filename = selectedFile ? selectedFile.name.replace(/\.[^/.]+$/, "") : 'analysis';
      setExportCount(prev => prev + 1);
      const response = await fetch('http://localhost:5000/export-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: analysisResult, filename: filename, count: exportCount + 1 }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to export PDF from backend');
      }

      const blob = await response.blob();
      const suggestedName = `${filename}_analysis_report_${exportCount + 1}.pdf`;

      // Use File System Access API to prompt for save location if supported
      if (window.showSaveFilePicker) {
        try {
          const fileHandle = await window.showSaveFilePicker({
            suggestedName: suggestedName,
            types: [{
              description: 'PDF files',
              accept: { 'application/pdf': ['.pdf'] },
            }],
          });
          const writable = await fileHandle.createWritable();
          await writable.write(blob);
          await writable.close();
          console.log('PDF saved successfully via File System Access API');
        } catch (fsError) {
          if (fsError.name !== 'AbortError') {
            throw fsError; // Re-throw if not user cancellation
          }
          // Fall through to legacy download if user cancels or errors
        }
      }

      // Fallback to legacy download method
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', suggestedName);
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url); // Clean up the URL object
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
          onExport={exportPDF}
          hasResults={!!analysisResult}
        />
      </div>
    </div>
  );
}

export default App;
