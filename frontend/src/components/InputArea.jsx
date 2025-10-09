import React, { useState, useRef } from 'react';
import { FaSearch, FaVolumeMute, FaLightbulb, FaPaperclip, FaMicrophone, FaPaperPlane, FaTimes, FaFileAlt } from 'react-icons/fa';
import './InputArea.css';

function InputArea({ onAnalyze, onFileAnalyze, onChatMessage, selectedFile, isFileLoading, isChatLoading }) {
  const [inputText, setInputText] = useState('');
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

  const handleSearchClick = () => {
    alert('Search icon clicked - implement search functionality');
  };

  const handleMuteClick = () => {
    alert('Mute icon clicked - implement mute functionality');
  };

  const handleLightbulbClick = () => {
    alert('Lightbulb icon clicked - implement suggestions or help');
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
    alert('Microphone icon clicked - implement voice input');
  };

  const clearSelectedFile = (e) => {
    e.stopPropagation();
    if (onFileAnalyze) {
      onFileAnalyze(null);
    }
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
      <button className="icon-button" title="Search" onClick={handleSearchClick} disabled={isFileLoading}>
        <FaSearch />
      </button>
      <button className="icon-button" title="Mute" onClick={handleMuteClick} disabled={isFileLoading}>
        <FaVolumeMute />
      </button>
      <button className="icon-button" title="Lightbulb" onClick={handleLightbulbClick} disabled={isFileLoading}>
        <FaLightbulb />
      </button>
      <input
        type="text"
        className="input-text-light"
        placeholder={isFileLoading ? "Processing file..." : "Ask a follow-up"}
        value={inputText}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        disabled={isFileLoading}
      />
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
      <button className="icon-button" title="Microphone" onClick={handleMicClick} disabled={isFileLoading}>
        <FaMicrophone />
      </button>
      <button className="icon-button send-button" title="Send" onClick={handleAnalyzeClick} disabled={isChatLoading}>
        {isChatLoading ? '...' : <FaPaperPlane />}
      </button>
      {selectedFile && (
        <div className="selected-file-info" title={selectedFile.name}>
          <FaFileAlt className="file-icon" />
          <span className="file-name">{selectedFile.name}</span>
          <span className="file-size">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</span>
          <span className="file-type">{selectedFile.type}</span>
          <button className="clear-file-button" onClick={clearSelectedFile} title="Remove file" disabled={isFileLoading}>
            <FaTimes />
          </button>
        </div>
      )}
    </div>
  );
}

export default InputArea;
