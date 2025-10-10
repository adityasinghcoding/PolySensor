# PolySensor - Multimodal AI Content Analyzer

## Project Overview

PolySensor is a comprehensive multimodal AI assistant designed to analyze and extract insights from various types of digital content including documents, images, audio files, and videos. The system leverages Google's Gemini 2.5 Pro AI model through LangChain to provide structured analysis and pattern detection across multiple media types.

### Key Features

- **Document Analysis**: Processes 40+ document formats (PDF, DOCX, TXT, CSV, etc.) using Unstructured library
- **Image Analysis**: Extracts text and analyzes visual content from images (JPG, PNG, WebP, HEIF)
- **Audio Processing**: Transcribes and analyzes audio content (MP3, WAV, AAC, OGG, FLAC) with 1-minute limit
- **Video Analysis**: Processes video files (MP4, MPEG, MOV, AVI, etc.) with 30-second limit including OCR and audio transcription
- **Web Interface**: Modern React-based frontend for easy file uploads and result visualization
- **RESTful API**: Flask-based backend with CORS support for seamless frontend integration
- **Structured Output**: AI-generated analysis presented in organized table format with insights and patterns

## Architecture

### Backend Architecture

The backend is built with Flask and consists of the following components:

- **Main Application** (`main.py`): Flask server with single endpoint `/analyze0` for file processing
- **Data Handling** (`data_handling.py`): Media processing functions for different file types
- **Prompts** (`prompts.py`): Specialized AI prompts for each media type
- **Environment Configuration**: Uses python-dotenv for API key management

### Frontend Architecture

The frontend is a React application built with Vite:

- **Components**:
  - `FileUploader`: Drag-and-drop file upload interface
  - `AnalysisResults`: Displays AI-generated analysis in formatted tables
  - `Loading`: Progress indicator during processing
- **Pages**: Single-page application with analyze functionality
- **API Service** (`apiService.js`): Handles communication with backend API

### Data Flow

1. User uploads file through React frontend
2. Frontend sends file to Flask backend via POST request to `/analyze0`
3. Backend detects file type by extension
4. File is processed using appropriate libraries (Unstructured, Pytesseract, SpeechRecognition, MoviePy)
5. Processed data is sent to Google Gemini AI with specialized prompts
6. AI response is formatted and returned to frontend
7. Results are displayed in structured format

## Installation

### Prerequisites

- Python 3.11+ (recommended)
- Node.js 16+ and npm
- Google Gemini API key
- Tesseract OCR (for image/video text extraction)
- FFmpeg (for audio/video processing)

### Backend Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/adityasinghcoding/PolySensor.git
   cd PolySensor
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables:**
   Create a `.env` file in the project root:
   ```
   GOOGLE_API_KEY=your_google_gemini_api_key_here
   ```

5. **Install system dependencies:**
   - **Tesseract OCR**: Download from https://github.com/UB-Mannheim/tesseract/wiki and add to PATH
   - **FFmpeg**: Download from https://www.gyan.dev/ffmpeg/builds/ and add bin folder to PATH

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

## Usage

### Running the Application

1. **Start the backend server:**
   ```bash
   python main.py
   ```
   The server will start on `http://localhost:5000`

2. **Start the frontend (in a separate terminal):**
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will be available on `http://localhost:5173` (default Vite port)

### Using the Application

1. Open the frontend in your browser
2. Drag and drop or click to select a file
3. Supported formats will be automatically detected
4. Wait for processing (may take several seconds for AI analysis)
5. View structured analysis results in table format

### File Type Support

| Category | Supported Extensions | Processing Method |
|----------|---------------------|-------------------|
| Documents | .pdf, .docx, .txt, .csv, .html, .md, .rtf, etc. (40+ formats) | Unstructured library extraction |
| Images | .jpg, .png, .jpeg, .webp, .heif | Direct AI vision analysis |
| Audio | .mp3, .wav, .aiff, .aac, .ogg, .flac | Speech recognition + AI analysis (max 1 min) |
| Video | .mp4, .mpeg, .mov, .avi, .x-flav, .mpg, .webm, .wmv, .3gpp | OCR + audio transcription + AI analysis (max 30 sec) |

## API Documentation

### Backend API

#### POST /analyze0

Analyzes uploaded files and returns AI-generated insights.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: `file` (binary file data)

**Response:**
- Success (200): `{"result": "AI analysis text"}`
- Error (400): `{"error": "Error message"}`
- Server Error (500): `{"error": "Internal server error"}`

**Example:**
```bash
curl -X POST -F "file=@document.pdf" http://localhost:5000/analyze0
```

## Configuration

### Environment Variables

- `GOOGLE_API_KEY`: Required. Your Google Gemini API key for AI processing

### File Upload Limits

- **Audio files**: Maximum 1 minute duration
- **Video files**: Maximum 30 seconds duration
- **File size**: Limited by Flask's default upload size (can be configured)

### AI Prompts

Custom prompts for different media types are defined in `prompts.py`:

- `DOCUMENT_PROMPT`: For document analysis
- `IMAGE_PROMPT`: For image analysis
- `AUDIO_PROMPT`: For audio transcription and analysis
- `VIDEO_PROMPT`: For video content analysis

## File Structure

```
PolySensor/
├── main.py                 # Flask backend server
├── data_handling.py        # Media processing functions
├── prompts.py             # AI prompt templates
├── requirements.txt       # Python dependencies
├── .env                   # Environment variables (create this)
├── .gitignore            # Git ignore rules
├── README.md             # Project README
├── DOCS/                 # Documentation
│   └── Project_Documentation.md
├── frontend/             # React frontend
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── components/
│   │   │   ├── FileUploader/
│   │   │   ├── AnalysisResults/
│   │   │   └── Loading/
│   │   ├── pages/
│   │   │   └── AnalyzePage.jsx
│   │   ├── utils/
│   │   │   └── apiService.js
│   │   └── assets/
│   └── public/
├── assets/               # Project assets
└── utilities/            # Additional tools
```

## Dependencies

### Python Dependencies

- `unstructured[all-docs]`: Document processing
- `langchain`: AI orchestration
- `langchain-google-genai`: Google Gemini integration
- `flask`: Web framework
- `flask-cors`: Cross-origin support
- `pytesseract`: OCR for images
- `Pillow`: Image processing
- `SpeechRecognition`: Audio transcription
- `pydub`: Audio format conversion
- `moviepy`: Video processing
- `python-dotenv`: Environment management

### Node.js Dependencies

- `react`: Frontend framework
- `react-dom`: React DOM rendering
- `@vitejs/plugin-react`: Vite React plugin
- `vite`: Build tool
- Additional UI dependencies as specified in `frontend/package.json`

## Troubleshooting

### Common Issues

1. **"Failed to digest the file: Please check if the backend server is running."**
   - Ensure the backend server is running on port 5000
   - Check that `python main.py` was executed successfully
   - Verify the frontend is configured to connect to `http://localhost:5000`

2. **"HTTP error! status: 500"**
   - Check backend console for error messages
   - Ensure GOOGLE_API_KEY is properly set in .env file
   - Verify all Python dependencies are installed

3. **"Unsupported file type or processing failed"**
   - Confirm the file extension is supported (see File Type Support table)
   - Check file size limits for audio/video
   - Ensure system dependencies (Tesseract, FFmpeg) are installed and in PATH

4. **AI processing fails**
   - Verify Google API key is valid and has sufficient quota
   - Check internet connection for API calls
   - Review AI prompts in `prompts.py` for issues

### System Requirements

- **Python**: 3.11+ recommended
- **Memory**: 4GB+ RAM recommended for video processing
- **Storage**: Sufficient space for temporary file processing
- **Network**: Stable internet for Google API calls

## Development

### Adding New File Types

1. Add file extensions to appropriate tuples in `main.py`
2. Implement processing logic in `data_handling.py`
3. Create or modify AI prompt in `prompts.py`
4. Update frontend file type detection in `apiService.js`

### Modifying AI Prompts

Edit the prompt templates in `prompts.py` to customize AI analysis behavior for different media types.

### Extending the API

Add new endpoints in `main.py` following the existing pattern with proper error handling and CORS support.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -am 'Add feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Credits

- **Developer**: Aditya Singh
- **GitHub**: https://github.com/adityasinghcoding
- **LinkedIn**: https://www.linkedin.com/in/adityasingh2022/

## Version History

- **v1.0.0**: Initial release with multimodal AI analysis capabilities
- Support for documents, images, audio, and video processing
- React frontend with Flask backend
- Google Gemini AI integration