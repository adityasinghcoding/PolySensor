# TODO: Add Hamburger Menu and PDF Export Feature

## Current Work
Implementing a hamburger menu in the App header with an "Export to PDF" option for analysis results. This includes installing dependencies, adding UI elements, and PDF generation logic.

## Key Technical Concepts
- React state management (useState for menu toggle).
- Client-side PDF generation using jsPDF and html2canvas.
- CSS for dropdown menu positioning and styling.
- Conditional rendering based on analysisResult availability.

## Relevant Files and Code
- App.jsx: Main app component; will add menu state, hamburger button, dropdown, and exportPDF function.
  - Current header: `<header className='app-header'>...</header>`
  - Add: Hamburger div/button, menu dropdown with li for export.
- App.css: Global styles; add .hamburger, .menu-dropdown, etc.
- No changes to AnalysisResults.jsx or other components.

## Problem Solving
- No existing menu: Adding new UI without disrupting layout.
- PDF capture: Use html2canvas on .result-content div to screenshot rendered Markdown, then embed in jsPDF.
- Windows cmd compatibility: Use '&' instead of '&&' for commands.

## Pending Tasks and Next Steps
- [ ] Install dependencies: cd frontend & npm install jspdf html2canvas
- [ ] Edit App.css: Add styles for hamburger menu and dropdown.
- [ ] Edit App.jsx: 
  - Import jsPDF and html2canvas.
  - Add isMenuOpen state.
  - Add hamburger button in header.
  - Add dropdown menu with "Export to PDF" (conditional on analysisResult).
  - Implement exportPDF function: Capture .result-content, generate PDF, download.
- [ ] Test: Toggle menu, export PDF with sample results, verify download and content fidelity.
- [ ] Update TODO: Mark completed steps.

From recent conversation: User confirmed plan to proceed with hamburger menu and PDF export.
