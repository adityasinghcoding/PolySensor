import React, { useRef } from "react";
import './FileUploader.css'

function FileUploader({ onFileSelect, selectedFile }) {
   const fileInputRef = useRef(null);

   const handleFileChange = (event) => {
      const file = event.target.files[0];
      if (file) {
         onFileSelect(file);
      }
   };

   const handleDrop = (event) => {
      event.preventDefault();
      const file = event.dataTransfer.files[0];
      if (file) {
         onFileSelect(file);
      }
   };

   const handleDragOver = (event) => {
      event.preventDefault();
   };

   const openFileDialog = () => {
      fileInputRef.current?.click();
   };


   return (
      <div
         className="file-uploader"
         onDrop={handleDrop}
         onDragOver={handleDragOver}
         onClick={openFileDialog}
      >
         <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="file-input"
            accept=".cwk, .mcw, .csv, .dif, .dbf, .eml, .msg, .p7s, .epub, .htm, .html, .bmp, .heic, .prn, .tiff, .md, .odt, .org, .eth, .pbd, .sdp, .pdf, .txt, .pot, .ppt, .pptm, .pptx, .rst, .rtf, .et, .fods, .mw, .xls, .xlsx, .sxg, .tsv, .abw, .doc, .docm, .docx, .dot, .dotm, .hwp, .zabw, .xml, .jpg, .png, .jpeg, .webp, .heif, .mp3, .wav, .aiff, .aac, .ogg, .flac, .mp4, .mpeg, .mov, .avi, .x-flav, .mpg, .webm, .wmv, .3gpp"
         />
      <div className="upload-area">
         {selectedFile ? (
            <div className="file-info">
               <div className="file-icon">📄</div>
               <div className="file-details">
                     <div className="file-name">{selectedFile.name}</div>
                     <div className="file-size">
                        {(selectedFile.size / (1024*1024)).toFixed(2)} MB
                     </div>
                     <div className="file-type">{selectedFile.type}</div>
               </div>
            </div>
         ) : (
            <div className="upload-prompt">
               <div className="upload-icon">⬆️</div>
               <h3>Click to upload or drag and drop</h3>
               <p>You can feed me 😋 documents, images, audio, and video files</p>
            </div>
         )}
      </div>

   </div>
   );
}

export default FileUploader;