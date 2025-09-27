import React from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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

function fixMarkdownTables(markdown) {
   // First preprocess HTML tags
   let processedMarkdown = preprocessMarkdown(markdown);
   
   // Rest of your existing table fixing logic...
   const lines = processedMarkdown.split('\n');

   for (let i = 0; i < lines.length - 1; i++) {
      if (/^ *:?-{3,}:? *( *\| *:?-{3,}:? *)*$/.test(lines[i+1].trim())) {
         if (!lines[i].trim().startsWith('|')) {
               lines[i] = '| ' + lines[i].trim().replace(/\s+/g, ' | ') + ' |';
         }
         if (!lines[i+1].trim().startsWith('|')) {
               const cols = lines[i].split('|').length - 2;
               lines[i+1] = '|' + ' --- |'.repeat(cols);
         }
      }
   }
   return lines.join('\n');
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