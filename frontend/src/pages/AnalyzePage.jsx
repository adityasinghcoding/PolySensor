import React from "react";
import AnalysisResults from '../components/AnalysisResults';
import Loading from '../components/Loading/Loading';

function AnalyzePage({ analysisResult, error, isLoading }) {
   return (
      <div className="analyze-page">
         {error && (
            <div className="error-message">
               {error.split('\n').map((line, index) => (
                  <React.Fragment key={index}>
                     {line}
                     {index < error.split('\n').length - 1 && <br />}
                  </React.Fragment>
               ))}
            </div>
         )}

         {isLoading && (
            <Loading />
         )}

         {analysisResult && (
            <AnalysisResults result={analysisResult} />
         )}
      </div>
   );
}

export default AnalyzePage;
