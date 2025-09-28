import React, { useRef } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
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
    // First, replace <br> tags with proper markdown line breaks
    let processedMarkdown = markdown.replace(/<br\s*\/?>\s*/gi, '  \n');
    
    // Split input into lines
    const lines = processedMarkdown.split('\n');

    let i = 0;
    while (i < lines.length) {
        let line = lines[i].trim();

        // Look for table indicators like "Table X:" or lines with multiple pipes
        if (line.includes('Table ') || (line.includes('|') && line.split('|').length > 2)) {
            // Potential table start
            let tableLines = [];
            let headerFound = false;
            let separatorFound = false;
            let numCols = 0;
            let titleLine = null;

            // Collect potential table lines
            while (i < lines.length && (lines[i].trim().includes('|') || lines[i].trim() === '' || !headerFound || !separatorFound)) {
                let currentLine = lines[i].trim();
                tableLines.push(lines[i]);

                if (currentLine.includes('|') && currentLine.split('|').length > 2) {
                    if (!headerFound) {
                        // Check if this looks like a title row with markdown header inside pipes
                        if (currentLine.includes('#')) {
                            // Extract the title content
                            const titleMatch = currentLine.match(/\|(.*?)\|/);
                            if (titleMatch) {
                                const titleContent = titleMatch[1].trim();
                                // Determine header level from # count
                                const headerLevel = (titleContent.match(/#/g) || []).length;
                                titleLine = `${'#'.repeat(Math.min(headerLevel, 6))} ${titleContent.replace(/^\#+/, '').trim()}`;
                                // Remove this line from tableLines as it's the title
                                tableLines.pop();
                                i++; // Skip to next
                                continue;
                            }
                        }
                        headerFound = true;
                        // Extract columns from header
                        const parts = currentLine.split('|').map(p => p.trim()).filter(p => p !== '');
                        numCols = parts.length;
                    } else if (!separatorFound && currentLine.includes('---')) {
                        separatorFound = true;
                    }
                }
                i++;
            }

            if (titleLine) {
                // Insert title before the table
                const startIndex = i - tableLines.length;
                lines.splice(startIndex, 0, titleLine);
                i = startIndex + 1;
            }

            if (numCols > 0 && tableLines.length > 0) {
                // Fix header: Ensure it starts and ends with |
                let header = tableLines[0].trim();
                if (!header.startsWith('|')) header = '|' + header;
                if (!header.endsWith('|')) header += '|';
                const headerCols = header.split('|').map(col => col.trim()).slice(1, -1); // Remove outer pipes
                while (headerCols.length < numCols) headerCols.push('');
                header = '| ' + headerCols.join(' | ') + ' |';
                tableLines[0] = header;

                // Add or fix separator if missing
                let separator = tableLines.findIndex(l => l.trim().includes('---'));
                if (separator === -1) {
                    // Insert after header
                    let sep = '|';
                    for (let j = 0; j < numCols; j++) {
                        sep += ' --- |';
                    }
                    tableLines.splice(1, 0, sep);
                } else {
                    // Fix existing separator
                    let sepLine = tableLines[separator].trim();
                    if (!sepLine.startsWith('|')) sepLine = '|' + sepLine;
                    if (!sepLine.endsWith('|')) sepLine += '|';
                    const sepParts = sepLine.split('|').map(p => p.trim()).slice(1, -1);
                    let fixedSep = '|';
                    for (let j = 0; j < numCols; j++) {
                        fixedSep += ' --- |';
                    }
                    tableLines[separator] = fixedSep;
                }

                // Fix data rows
                for (let j = (separatorFound ? 2 : 1); j < tableLines.length; j++) {
                    let row = tableLines[j].trim();
                    if (row.includes('|')) {
                        if (!row.startsWith('|')) row = '|' + row;
                        if (!row.endsWith('|')) row += '|';
                        const rowCols = row.split('|').map(col => col.trim()).slice(1, -1);
                        while (rowCols.length < numCols) rowCols.push('');
                        if (rowCols.length > numCols) rowCols.length = numCols; // Truncate if too many
                        tableLines[j] = '| ' + rowCols.join(' | ') + ' |';
                    }
                }

                // Replace the collected lines back
                const startIndex = i - tableLines.length;
                lines.splice(startIndex, tableLines.length, ...tableLines);
                i = startIndex + tableLines.length;
            } else {
                i++;
            }
        } else {
            i++;
        }
    }

    // Rejoin lines and return
    return lines.join('\n');
}

function AnalysisResults({ result }) {
   const preprocessed = preprocessMarkdown(result);
   const fixedResult = fixMarkdownTables(preprocessed);
   const contentRef = useRef(null);

   const exportPDF = async () => {
      if (!contentRef.current) return;

      try {
         const canvas = await html2canvas(contentRef.current, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
         });

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
      } catch (err) {
         console.error('PDF export failed:', err);
      }
   };

   return (
      <div className='analysis-results'>
         <h2>Analysis Results</h2>
         <div className='result-content' ref={contentRef}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{fixedResult}</ReactMarkdown>
         </div>
         <button 
            onClick={exportPDF} 
            className='export-button'
            title="Export to PDF"
         >
            📄
         </button>
      </div>
   );
}

export default AnalysisResults