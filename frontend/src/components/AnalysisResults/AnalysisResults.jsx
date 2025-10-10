import React from "react";
import MarkdownToJSX from 'markdown-to-jsx';
import './AnalysisResults.css'

function preprocessMarkdown(markdown) {
   // Replace common HTML tags with markdown equivalents
    return markdown
      .replace(/<br\s*\/?>/gi, '  \n') // <br> to markdown line break
      .replace(/<b>(.*?)<\/b>/gi, '**$1**') // <b> to bold
      .replace(/<strong>(.*?)<\/strong>/gi, '**$1**') // <strong> to bold
      .replace(/<i>(.*?)<\/i>/gi, '*$1*') // <i> to italic
      .replace(/<em>(.*?)<\/em>/gi, '*$1*'); // <em> to italic
}

function AnalysisResults({ result }) {
   const processedResult = preprocessMarkdown(result);

   return (
      <div className='analysis-results'>
         <h2>Analysis Results</h2>
         <div className='result-content'>
            <MarkdownToJSX>{processedResult}</MarkdownToJSX>
         </div>
      </div>
   );
}

export default AnalysisResults
