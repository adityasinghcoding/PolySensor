import React from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './AnalysisResults.css'

function fixMarkdownTables(markdown) {
   // Add table separators if missing
   return markdown.replace(/(\|.*\|)\n(\|.*\|)/g, (match, headerLine, firstDataLine) => {
      const headerCells = headerLine.split('|').filter(cell => cell.trim() !== '');
      const separator = '|' + ' --- |'.repeat(headerCells.length);
      return headerLine + '\n' + separator + '\n' + firstDataLine;
   });
}

function AnalysisResults({ result }) {
   const fixedResult = fixMarkdownTables(result);
   return (
      <div className='analysis-results'>
         <h2>Analysis Results</h2>
         <div className='result-content'>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{fixedResult}</ReactMarkdown>
         </div>
      </div>
   );
}

export default AnalysisResults