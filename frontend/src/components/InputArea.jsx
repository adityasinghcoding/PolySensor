import React, { useState, useRef } from 'react';
import { FaPaperclip, FaMicrophone, FaMicrophoneSlash, FaPaperPlane, FaTimes, FaFileExport } from 'react-icons/fa';
import './InputArea.css';

function InputArea({ onAnalyze, onFileAnalyze, onChatMessage, selectedFile, isFileLoading, isChatLoading }) {
  const [inputText, setInputText] = useState('');
  const [isMicMuted, setIsMicMuted] = useState(true);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleChatOrAnalyze = () => {
    if (inputText.trim()) {
      if (onChatMessage) {
        onChatMessage(inputText.trim());
      } else if (onAnalyze) {
        onAnalyze(inputText.trim());
      }
      setInputText('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleChatOrAnalyze();
    }
  };

  const handleAnalyzeClick = () => {
    handleChatOrAnalyze();
  };

  const handleAttachClick = () => {
    if (fileInputRef.current && !isFileLoading) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && onFileAnalyze) {
      onFileAnalyze(file);
    }
    e.target.value = null; // reset file input
  };

  const handleMicClick = () => {
    setIsMicMuted(!isMicMuted);
  };

  const clearSelectedFile = (e) => {
    e.stopPropagation();
    if (onFileAnalyze) {
      onFileAnalyze(null);
    }
  };

  const handleExportClick = () => {
    // Implement export functionality here
    alert('Export button clicked - implement export functionality');
  };

  return (
    <div
      className="input-area-light"
      onDrop={(e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && onFileAnalyze && !isFileLoading) {
          onFileAnalyze(file);
        }
      }}
      onDragOver={(e) => e.preventDefault()}
    >
      <input
        type="text"
        className="input-text-light"
        placeholder={isFileLoading ? "Processing file..." : "Ask PolySensor or Upload file"}
        value={inputText}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        disabled={isFileLoading}
      />
      <button className="icon-button send-button" title="Send" onClick={handleAnalyzeClick} disabled={isChatLoading}>
        {isChatLoading ? '...' : <FaPaperPlane />}
      </button>
      <button className="icon-button" title="Attach file" onClick={handleAttachClick} disabled={isFileLoading}>
        <FaPaperclip />
      </button>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        disabled={isFileLoading}
      />
      <button className="icon-button" title={isMicMuted ? "Unmute Microphone" : "Mute Microphone"} onClick={handleMicClick} disabled={isFileLoading}>
        {isMicMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
      </button>
      <button className="icon-button" title="Export" onClick={handleExportClick} disabled={isFileLoading}>
        <FaFileExport />
      </button>
      {selectedFile && (
        <div className="selected-file-info" title={selectedFile.name}>
          <span className="file-name">{selectedFile.name}</span>
          <span className="file-size">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</span>
          <button className="clear-file-button" onClick={clearSelectedFile} title="Remove file" disabled={isFileLoading}>
            <FaTimes />
          </button>
        </div>
      )}
    </div>
  );
}

export default InputArea;
