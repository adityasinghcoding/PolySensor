import React from "react";
import './AnalysisResults.css'

function AnalysisResults({ result }) {
   return (
      <div className='analysis-results'>
         <h2>Analysis Results</h2>
         <div className='result-content'>
            {result}
         </div>
      </div>
   );
}

export default AnalysisResults