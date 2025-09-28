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
    // Split input into lines (already preprocessed)
    const lines = markdown.split('\n');

    let i = 0;
    while (i < lines.length) {
        let line = lines[i].trim();

        // Look for table indicators like "Table X:" or lines with multiple pipes
        if (line.includes('Table ') || (line.includes('|') && line.split('|').length > 2)) {
            let tableStart = i;
            let tableLines = [];
            let j = i;
            while (j < lines.length) {
                let curr = lines[j].trim();
                if ((curr.includes('|') && curr.split('|').length > 2) || curr === '') {
                    tableLines.push(lines[j]);
                    j++;
                } else {
                    break;
                }
            }

            // Check if first row is a title row
            let titleLine = null;
            if (tableLines.length > 0) {
                let firstRow = tableLines[0].trim();
                const cells = firstRow.split('|').map(p => p.trim()).filter(p => p !== '');
                if (cells.length > 0 && cells[0].startsWith('#')) {
                    const titleContent = cells[0].replace(/^\s*#+\s*/, '').trim();
                    const headerLevel = (cells[0].match(/#/g) || []).length;
                    titleLine = `${'#'.repeat(Math.min(headerLevel, 6))} ${titleContent}`;
                    // Remove the first row from tableLines
                    tableLines.shift();
                }
            }

            // Calculate max number of columns
            let numCols = 0;
            for (let row of tableLines) {
                if (row.trim().includes('|')) {
                    const cells = row.split('|').map(p => p.trim()).filter(p => p !== '');
                    numCols = Math.max(numCols, cells.length);
                }
            }

            // Fix header: assume first non-empty row is header
            let headerIndex = 0;
            while (headerIndex < tableLines.length && !tableLines[headerIndex].trim()) headerIndex++;
            if (headerIndex < tableLines.length) {
                let header = tableLines[headerIndex].trim();
                if (!header.startsWith('|')) header = '|' + header;
                if (!header.endsWith('|')) header += '|';
                let headerCols = header.split('|').map(c => c.trim()).slice(1, -1);
                while (headerCols.length < numCols) headerCols.push('');
                headerCols = headerCols.slice(0, numCols);
                tableLines[headerIndex] = '| ' + headerCols.join(' | ') + ' |';
            }

            // Ensure separator after header
            let sepIndex = headerIndex + 1;
            let hasSep = false;
            if (sepIndex < tableLines.length && tableLines[sepIndex].trim().includes('---')) {
                hasSep = true;
                let sep = '| ' + Array(numCols).fill('---').join(' | ') + ' |';
                tableLines[sepIndex] = sep;
            }
            if (!hasSep) {
                let sep = '| ' + Array(numCols).fill('---').join(' | ') + ' |';
                tableLines.splice(sepIndex, 0, sep);
                sepIndex = headerIndex + 1; // Update since we inserted
            }

            // Fix data rows after separator
            for (let k = sepIndex + 1; k < tableLines.length; k++) {
                let row = tableLines[k].trim();
                if (row.includes('|')) {
                    if (!row.startsWith('|')) row = '|' + row;
                    if (!row.endsWith('|')) row += '|';
                    let rowCols = row.split('|').map(c => c.trim()).slice(1, -1);
                    while (rowCols.length < numCols) rowCols.push('');
                    rowCols = rowCols.slice(0, numCols);
                    tableLines[k] = '| ' + rowCols.join(' | ') + ' |';
                }
            }

            // Insert back into lines
            let insertPos = tableStart;
            if (titleLine) {
                lines.splice(insertPos, 0, titleLine);
                insertPos += 1;
            }
            lines.splice(insertPos, tableLines.length, ...tableLines);
            i = insertPos + tableLines.length;
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