<div align="center">

# 🧠 PolySensor 🔍

### **AI-Powered Multi-Modal Content Intelligence**

</div>

<br>

A sophisticated Python application that leverages advanced AI to analyze and extract insights from virtually any type of media content. Built with cutting-edge technologies including LangChain and Google's Gemini model, PolySensor transforms unstructured data into actionable intelligence.

## 🌟 What Makes PolySensor Unique?

### 🧠 **Intelligent Content Understanding**
- **Multi-Modal Analysis**: Seamlessly processes documents, images, audio, and video files
- **Advanced RAG Architecture**: Utilizes Retrieval-Augmented Generation for superior contextual understanding
- **Universal Text Extraction**: Capable of extracting and analyzing textual information from almost any format

### 🔄 **Powered by State-of-the-Art AI**
- **Google Gemini Integration**: Harnesses the power of one of the most advanced LLMs available
- **LangChain Orchestration**: Professional-grade AI workflow management
- **Smart Context Awareness**: Understands content relationships and nuances

### 📊 **Comprehensive Content Coverage**
From research papers to multimedia presentations, PolySensor delivers deep analytical insights across:
- **Academic & Technical Documents**
- **Business Reports & Presentations** 
- **Multimedia Content & Recordings**
- **Visual Data & Infographics**

## ⚡ Quick Start

**Get started in under 2 minutes:**

```bash
# Clone & install
git clone <your-repo-url>
cd polysensor
pip install -r requirements.txt

# Run analysis on any file
python main.py

```
---

## 🌟 Features

- **Multi-Modal Support**: Process documents, images, audio, and video files
- **AI-Powered Analysis**: Uses Google Gemini 2.5 Pro for intelligent content summarization
- **Smart Text Extraction**: 
  - Documents: PDF, DOCX, TXT, and 40+ other formats
  - Images: OCR text extraction using Tesseract
  - Audio: Speech-to-text transcription
  - Videos: Frame-by-frame OCR + audio transcription
- **Modular Architecture**: Easy to extend with new file types and analysis methods

## 📋 Supported File Formats

<h2 align="center"><i>Documents and Text Files</i></h2>

<div align="center">

| Extension(s) | Description |
|--------------|-------------|
| `.pdf` | Portable Document Format |
| `.docx` | Microsoft Word Open XML Document |
| `.doc` | Microsoft Word Document (older format) |
| `.txt` | Plain Text File |
| `.odt` | OpenDocument Text File |
| `.rtf` | Rich Text Format |
| `.md` | Markdown Documentation |
| `.epub` | Electronic Publication |
| `.hwp` | Hangul Word Processor File |
| `.abw`, `.zabw` | AbiWord Document |
| `.org` | Lotus Organizer Data File or Data Analysis File |
| `.rst` | reStructuredText File |

</div>

<h2 align="center"><i>Spreadsheets</i></h2>

<div align="center">

| Extension(s) | Description |
|--------------|-------------|
| `.xlsx` | Microsoft Excel Open XML Spreadsheet |
| `.xls` | Microsoft Excel Spreadsheet (older format) |
| `.csv` | Comma-Separated Values File |
| `.tsv` | Tab-Separated Values File |
| `.fods` | OpenDocument Flat XML Spreadsheet |
| `.dif` | Data Interchange Format File |
| `.dbf` | dBase Database File |
| `.et` | E-Text Spreadsheet |

</div>

<h2 align="center"><i>Presentations</i></h2>

<div align="center">

| Extension(s) | Description |
|--------------|-------------|
| `.pptx` | Microsoft PowerPoint Open XML Presentation |
| `.ppt` | Microsoft PowerPoint Presentation (older format) |
| `.pptm` | Microsoft PowerPoint Macro-Enabled Presentation |
| `.pot` | Microsoft PowerPoint Template |

</div>

<h2 align="center"><i>Image Files</i></h2>

<div align="center">

| Extension(s) | Description |
|--------------|-------------|
| `.jpg`, `.jpeg` | JPEG images |
| `.png` | Portable Network Graphics |
| `.gif` | Graphics Interchange Format |
| `.webp` | WebP image |
| `.heic` | High Efficiency Image Format |
| `.tif`, `.tiff` | Tagged Image File Format |
| `.bmp` | Bitmap Image File |

</div>

<h2 align="center"><i>Email Files</i></h2>

<div align="center">

| Extension(s) | Description |
|--------------|-------------|
| `.msg` | Microsoft Outlook Message |
| `.eml` | Electronic Mail File |
| `.p7s` | PKCS #7 Signature File Format |

</div>

<h2 align="center"><i>Other File Types</i></h2>

<div align="center">

| Extension(s) | Description |
|--------------|-------------|
| `.xml` | Extensible Markup Language File |
| `.html`, `.htm` | Hypertext Markup Language File |
| `.md` | Markdown Documentation |
| `.cwk` | AppleWorks Document |
| `.mcw` | Microchip MPLAB Workspace |
| `.prn` | Print to File |
| `.eth` | Ethnograph Data File |
| `.pbd` | PowerBuilder Document |
| `.sdp` | Session Description Protocol File |
| `.mw` | MathWorks MATLAB Workspace File |
| `.sxg` | Signed Exchange File |

</div>

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- Google Gemini API key
- Tesseract OCR (for image/text extraction)

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd multi-modal-analyzer
```

2. **Install Dependencies**
```bash
pip install -r requirements.txt
```

3. **Install Tesseract OCR**
  - Windows: Download from [GitHub releases](https://github.com/UB-Mannheim/tesseract/wiki)
  - Mac: ```brew install tesseract```
  - Linux: ```sudo apt-get install tesseract-ocr```

4. **Set up environment variables**
```
cp .env.example .env
# Edit .env and add your Google API key
GOOGLE_API_KEY=your_api_key_here
```

### Usage
Run the application:
```
python main.py
```
When prompted, enter the path to your file:
```
Give path of the file without '':
"C:/path/to/your/file.extension"
```
The system will automatically detect the file type and provide an AI-generated analysis.

## 🏗️ Project Structure

```
multi-modal-analyzer/
├── main.py                # Main application entry point
├── prompts.py             # AI prompt templates
├── text_extractor.py      # Content extraction utilities
├── requirements.txt       # Python dependencies
├── .env                   # Environment variables
└── README.md              # This file
```
### Core Modules
`main.py`: Orchestrates the analysis pipeline, handles file type detection, and manages LLM chains
`prompts.py`: Contains optimized prompts for different content types
`text_extractor.py`: Handles actual content extraction from various file formats

## 🔧 Configuration
### API Keys
Get your Google Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey) and add it to your .env file:
```
GOOGLE_API_KEY=your_actual_api_key_here
```

### Customizing Analysis
You can modify the analysis prompts in `prompts.py` to tailor the output to your specific needs:
```
# Example custom prompt
CUSTOM_ANALYSIS = '''
Analyze this content and focus on technical details:

Content: {content_data} // Place holder which contains the function output

Please provide:
1. Technical specifications
2. Implementation details
3. Potential improvements
'''
```

## 💡 Examples
### Document Analysis
```
# Input: research_paper.pdf
# Output: Summary of key findings, methodology, and conclusions
```

### Image Analysis
```
# Input: diagram.png  
# Output: Extracted text + analysis of visual content and structure
```

### Video Analysis
```
# Input: presentation.mp4
# Output: Combined analysis of slide content and spoken presentation
```
## 🛠️ Development
### Adding New File Types
1. Add file extension detection in `main.py`:
```
if file_path.lower().endswith(('.new_extension')):
    new_data = new_extraction_function(file_path)
```

2. Create extraction function in `text_extractor.py`:
```
def new_extraction_function(file_path):
    # Implement extraction logic
    return extracted_content
```

3. Add prompt template in `prompts.py`:
```
NEW_TYPE = '''
Your analysis prompt for new file type...
'''
```

### Running Tests
```
# Add tests to the repository and run with:
python -m pytest tests/
```
## 📊 Output Examples
The AI provides structured analysis including:

- **Key Points**: Main takeaways from the content
- **Summary**: Concise overview of the material
- **Actionable Insights**: Practical recommendations
- **Ambiguity Detection**: Identification of unclear sections

## 🤝 Contributing
We welcome contributions! Please see our Contributing Guidelines for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🐛 Troubleshooting
### Common Issues
**"File does not exist" error**
- Check file path spelling
- Use absolute paths if needed

**OCR not working**
- Verify Tesseract installation
- Check image quality and resolution

**API key errors**
- Ensure `.env` file is in the project root
- Verify the API key has sufficient permissions

**Audio/video processing slow**
- Large files may take time to process
- Consider shorter intervals for video analysis

### Getting Help
- Check existing [Issues]() for similar problems
- Create a new issue with detailed error messages and file examples

## 🙏 Acknowledgments
- [LangChain](https://www.langchain.com/) for LLM orchestration
- [Google Gemini](https://deepmind.google/models/gemini/) for AI capabilities
- [Unstructured](https://github.com/Unstructured-IO/unstructured) for document parsing
- [Tesseract OCR](https://github.com/tesseract-ocr/tesseract) for text extraction

## ⚠️ Terms of Usage:
`
This tool is designed for content analysis and should be used in compliance with copyright laws and content usage rights. Always ensure you have permission to analyze and process the files you use with this system.
`
