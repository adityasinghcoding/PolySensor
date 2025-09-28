import React, { useState, useRef } from 'react';
import AnalyzePage from './pages/AnalyzePage';
import FileUploader from './components/FileUploader/FileUploader';
import './App.css';
import { analyzeFile } from './utils/apiService';
import logo from '../../assets/PolySensor no bg 200px.png';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const resultRef = useRef(null);

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

  const exportPDF = async () => {
    console.log('Export PDF called', analysisResult, resultRef.current);
    if (!analysisResult || !resultRef.current) return;

    try {
      const canvas = await html2canvas(resultRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
      });
      console.log('Canvas created', canvas);

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('analysis-results.pdf');
      console.log('PDF saved');
      setIsMenuOpen(false);
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
            <>
              <div className={`hamburger ${isMenuOpen ? 'open' : ''}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <span></span>
                <span></span>
                <span></span>
              </div>
              <ul className={`menu-dropdown ${isMenuOpen ? 'open' : ''}`}>
                <li className="menu-item" onClick={exportPDF}>
                  Export to PDF
                </li>
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
