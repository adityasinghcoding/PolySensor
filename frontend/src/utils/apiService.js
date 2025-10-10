const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const analyzeFile = async (file) => {
   const formData = new FormData();
   formData.append('file', file);

   try {
      const response = await fetch(`${API_BASE_URL}/analyze0`, {
         method: 'POST',
         body: formData,
      });

      if (!response.ok) {
         const errorData = await response.json().catch(() => ({}));
         throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.result;

   } catch (error) {
      console.error('API call failed:', error);
      throw error;
   }
};

export const analyzeText = async (text) => {
   try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify({ question: text }),
      });

      if (!response.ok) {
         const errorData = await response.json().catch(() => ({}));
         throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.answer;

   } catch (error) {
      console.error('API call failed:', error);
      throw error;
   }
};


// Utility function to detect the file type
export const getFileCategory = (fileName) => {
   const extension = fileName.toLowerCase().split('.').pop();

   const documentExtensions = [
  'cwk', 'mcw', 'csv', 'dif', 'dbf', 'eml', 'msg', 'p7s', 'epub',
  'htm', 'html', 'bmp', 'heic', 'prn', 'tiff',
  'md', 'odt', 'org', 'eth', 'pbd', 'sdp', 'pdf', 'txt', 'pot',
  'ppt', 'pptm', 'pptx', 'rst', 'rtf', 'et', 'fods', 'mw', 'xls',
  'xlsx', 'sxg', 'tsv', 'abw', 'doc', 'docm', 'docx', 'dot', 'dotm',
  'hwp', 'zabw', 'xml'
   ];

   const imageExtensions = ['jpg', 'png', 'jpeg', 'webp', 'heif'];
   const audioExtensions = ['mp3', 'wav', 'aiff', 'aac', 'ogg', 'flac'];
   const videoExtensions = ['mp4', 'mpeg', 'mov', 'avi', 'x-flav', 'mpg', 'webm', 'wmv', '3gpp'];

   // detecting file type and checking from mentioned extensions
   if (documentExtensions.includes(extension)) return 'document';
   if (imageExtensions.includes(extension)) return 'image';
   if (audioExtensions.includes(extension)) return 'audio';
   if (videoExtensions.includes(extension)) return 'video';

   return 'unknown';
};
