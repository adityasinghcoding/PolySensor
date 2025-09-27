import React from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './AnalysisResults.css'

function fixMarkdownTables(markdown) {
    // Split input into lines
    const lines = markdown.split('\n');

    for (let i = 0; i < lines.length - 1; i++) {
        // Check if next line contains only dashes or colons (separator line)
        if (/^ *:?-{3,}:? *( *\| *:?-{3,}:? *)*$/.test(lines[i+1].trim())) {
            // If current line doesn't have pipes, add pipes around it
            if (!lines[i].trim().startsWith('|')) {
                lines[i] = '| ' + lines[i].trim().replace(/\s+/g, ' | ') + ' |';
            }
            // Ensure separator line also starts and ends with pipes
            if (!lines[i+1].trim().startsWith('|')) {
                const cols = lines[i].split('|').length - 2; // exclude ends
                lines[i+1] = '|' + ' --- |'.repeat(cols);
            }
        }
    }
    // Rejoin lines and return
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