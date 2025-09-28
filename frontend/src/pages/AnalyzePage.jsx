import React from "react";
import AnalysisResults from '../components/AnalysisResults';
import Loading from '../components/Loading/Loading';

function AnalyzePage({ selectedFile, analysisResult, error, isLoading, resultRef }) {
   return (
      <div className="analyze-page">
         {error && (
            <div className="error-message">
               {error}
            </div>
         )}

         {isLoading && (
            <Loading />
         )}

         {analysisResult && (
            <AnalysisResults result={analysisResult} resultRef={resultRef} />
         )}
      </div>
   );
}

export default AnalyzePage;
