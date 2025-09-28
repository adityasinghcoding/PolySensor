import React, { useRef } from "react";
import MarkdownToJSX from 'markdown-to-jsx';
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

function AnalysisResults({ result }) {
   const processedResult = preprocessMarkdown(result);
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
            <MarkdownToJSX>{processedResult}</MarkdownToJSX>
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
