# Content Analyzer

A **Content Analyzer** which supports wide range of content, especially textual content.
It's powered by the LLM which utilizes the RAG technique.
Capable of analyzing the textual information from almmost anything.

## Features
Content Analyzer supports:

file_extensions = {
    "Documents and Text Files": {
        ".pdf": "Portable Document Format",
        ".docx": "Microsoft Word Open XML Document",
        ".doc": "Microsoft Word 97-2003 Document",
        ".txt": "Plain Text File",
        ".odt": "OpenDocument Text File",
        ".rtf": "Rich Text Format File",
        ".md": "Markdown Document",
        ".epub": "Electronic Publication",
        ".hwp": "Hangul Word Processor File",
        ".abw": "AbiWord Document",
        ".zabw": "AbiWord GZipped Document",
        ".rst": "reStructuredText File",
        ".dotm": "Microsoft Word Macro-Enabled Template",
        ".dot": "Microsoft Word 97-2003 Template",
        ".cwk": "AppleWorks Document",
    },
    "Spreadsheets and Databases": {
        ".xlsx": "Microsoft Excel Open XML Spreadsheet",
        ".xls": "Microsoft Excel 97-2003 Workbook",
        ".csv": "Comma-Separated Values File",
        ".tsv": "Tab-Separated Values File",
        ".dbf": "dBase Database File",
        ".fods": "OpenDocument Flat XML Spreadsheet",
        ".et": "E-Text Spreadsheet",
        ".dif": "Data Interchange Format File",
    },
    "Presentations": {
        ".pptx": "PowerPoint Open XML Presentation",
        ".ppt": "PowerPoint Presentation",
        ".pptm": "PowerPoint Macro-Enabled Presentation",
        ".pot": "PowerPoint Template",
    },
    "Image Files": {
        ".heic": "High-Efficiency Image Container",
        ".bmp": "Bitmap Image File",
        ".tiff": "Tagged Image File Format",
    },
    "Web and Markup": {
        ".html": "HyperText Markup Language File",
        ".htm": "HyperText Markup Language File",
        ".xml": "Extensible Markup Language File",
        ".sxg": "Signed Exchange File",
    },
    "Email and Certificates": {
        ".msg": "Microsoft Outlook Item",
        ".eml": "Electronic Mail File",
        ".p7s": "PKCS #7 Signature File",
    },
    "Other File Types": {
        ".mw": "MathWorks MATLAB Workspace File",
        ".prn": "Print to File",
        ".mcw": "Microchip MPLAB Workspace",
        ".eth": "Ethnograph Data File",
        ".pbd": "PowerBuilder Document",
        ".sdp": "Session Description Protocol File",
        ".org": "Org Mode Plain Text File",
    }
}

