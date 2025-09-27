import React, { useState } from "react";
import FileUploader from "../components/FileUploader/FileUploader";
import AnalysisResults from '../components/AnalysisResults';
import { analyzeFile } from '../utils/apiService';

function AnalyzePage() {
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
         setError('Failed to analyze content. Please try again.');
         console.error('Analysis error:', err);
      }  finally {
         setIsLoading(false);
      }
   };


   return (
      <div className="analyze-page">
         <FileUploader 
            onFileSelect={handleFileSelect}
            selectedFile={selectedFile}
         />

         {selectedFile && (
            <div className="analyze-controls">
               <button
                  onClick={handleAnalyze}
                  disabled={isLoading}
                  className="analyze-button"
               >
                  {isLoading ? 'Analyzing...' : 'Analyze File'}
               </button>
            </div>
      )}

      {error && (
         <div className="error-message">
            {error}
         </div>
      )}

      {analysisResult && (
         <AnalysisResults result={analysisResult} />
      )}
      </div>
   );
}

export default AnalyzePage;
