import os
from dotenv import load_dotenv, find_dotenv, set_key
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain_core.messages import HumanMessage
import base64
import getpass
from prompts import DOCUMENT_PROMPT, AUDIO_PROMPT, VIDEO_PROMPT, IMAGE_PROMPT
from data_handling import (
   unstructured_doc_extraction,
   audio,
   image,
   video
   )
from io import BytesIO
# import mimetypes
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

load_dotenv(find_dotenv())  # loading the environment variables from .env

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    GOOGLE_API_KEY = getpass.getpass("Enter API Key:")
    if GOOGLE_API_KEY:
        dotenv_path = find_dotenv()
        if not dotenv_path:
            dotenv_path = '.env'
        set_key(dotenv_path, 'GOOGLE_API_KEY', GOOGLE_API_KEY)
        os.environ["GOOGLE_API_KEY"] = GOOGLE_API_KEY

llm = ChatGoogleGenerativeAI(model='gemini-2.5-pro', google_api_key=GOOGLE_API_KEY)

document_prompt = PromptTemplate(input_variables=['doc_json_data'], template=DOCUMENT_PROMPT)
# audio_prompt = PromptTemplate(input_variables=['audio_data'], template=AUDIO_PROMPT)
# image_prompt = PromptTemplate(input_variables=['image_data'], template=IMAGE_PROMPT)
# video_prompt = PromptTemplate(input_variables=['video_data'], template=VIDEO_PROMPT)

document_chain = LLMChain(llm=llm, prompt=document_prompt)
# image_chain = LLMChain(llm=llm, prompt = image_prompt)
# audio_chain = LLMChain(llm=llm, prompt = audio_prompt)
# video_chain = LLMChain(llm=llm, prompt = video_prompt)

doc_extensions = (
    '.cwk', '.mcw', '.csv', '.dif', '.dbf', '.eml', '.msg', '.p7s', '.epub',
    '.htm', '.html', '.bmp', '.heic', '.prn', '.tiff',
    '.md', '.odt', '.org', '.eth', '.pbd', '.sdp', '.pdf', '.txt', '.pot',
    '.ppt', '.pptm', '.pptx', '.rst', '.rtf', '.et', '.fods', '.mw', '.xls',
    '.xlsx', '.sxg', '.tsv', '.abw', '.doc', '.docm', '.docx', '.dot', '.dotm',
    '.hwp', '.zabw', '.xml'
)

image_extensions = ('.jpg', '.png', '.jpeg', '.webp', '.heif')
audio_extensions = ('.mp3', '.wav', '.aiff', '.aac', '.ogg', '.flac')
video_extensions = ('.mp4', '.mpeg', '.mov', '.avi', '.x-flav', '.mpg', '.webm', '.wmv', '.3gpp')

app = Flask(__name__)
CORS(app)  # this allows react app to communicate with this backend

@app.route('/analyze0', methods=['POST'])
def analyze_file():
   file_path = None
   try:
      if 'file' not in request.files:
         return jsonify({'error': 'No file provided'}), 400

      file = request.files['file']
      if file.filename == '':
         return jsonify({'error': 'No file selected'}), 400

      # saving file temporarily
      file_path = os.path.join('temp', file.filename)
      os.makedirs('temp', exist_ok=True)
      file.save(file_path)

      result = None

      if file_path.lower().endswith(doc_extensions):
         doc_json_data = unstructured_doc_extraction(file_path)
         if isinstance(doc_json_data, str):
            os.remove(file_path)
            return jsonify({'error': doc_json_data}), 400
         if doc_json_data:
               llm_doc_output = document_chain.run(doc_json_data=doc_json_data)
               result = llm_doc_output

      elif file_path.lower().endswith(image_extensions):
         image_result = image(file_path)
         if not os.path.exists(image_result):
            os.remove(file_path)
            
         if isinstance(image_result, str):
            return jsonify({'error': image_result}), 400
         image_path = image_result
         if image_path:
               with open(image_path, "rb") as img:
                  image_bytes = img.read()
                  prompt_with_image = HumanMessage(
                     content=[
                           {
                              'type': 'text',
                              'text': IMAGE_PROMPT
                           },
                           {
                              'type': 'image_url',
                              'image_url': f"data:image/png;base64,{base64.b64encode(image_bytes).decode('utf-8')}"
                           }
                     ]
                  )
                  final_image_prompt = llm.invoke([prompt_with_image])
                  result = final_image_prompt.content

      elif file_path.lower().endswith(audio_extensions):
         audio_result = audio(file_path)
         if isinstance(audio_result, str):
            os.remove(file_path)
            return jsonify({'error': audio_result}), 400
         audio_path = audio_result
         if audio_path:
               buffer = BytesIO()
               audio_path.export(buffer, format='mp3')
               audio_bytes = buffer.getvalue()

               prompt_with_audio = HumanMessage([
                  {
                     'type': 'text',
                     'text': AUDIO_PROMPT
                  },
                  {
                     'type': 'media',
                     'mime_type': 'audio/mp3',
                     'data': base64.b64encode(audio_bytes).decode('utf-8')
                  }
               ])
               final_audio_prompt = llm.invoke([prompt_with_audio])
               result = final_audio_prompt.content

      elif file_path.lower().endswith(video_extensions):
         video_result = video(file_path)
         if not os.path.exists(video_result):
            os.remove(file_path)

         if isinstance(video_result, str):
            return jsonify({'error': video_result}), 400
         video_path = video_result
         if video_path:
               with open(video_path, "rb") as vid:
                  video_bytes = vid.read()
                  mime_type = 'video/mp4' if file_path.lower().endswith('.mp4') else 'video/mpeg'  # adjust as needed
                  prompt_with_video = HumanMessage([
                     {
                           'type': 'text',
                           'text': VIDEO_PROMPT
                     },
                     {
                           'type': 'media',
                           'mime_type': mime_type,
                           'data': base64.b64encode(video_bytes).decode('utf-8')
                     }
                  ])
                  final_video_prompt = llm.invoke([prompt_with_video])
                  result = final_video_prompt.content

      if result:
         # cleaning memory
         os.remove(file_path)
         return jsonify({'result': result})
      else:
         os.remove(file_path)
         return jsonify({'error': 'Unsupported file type or processing failed'}), 400

   except Exception as e:
      return jsonify({'error': str(e)}), 500
   finally:
      # Cleanup temp file and folder if possible
      if file_path and os.path.exists(file_path):
         os.remove(file_path)
      temp_dir = 'temp'
      if os.path.exists(temp_dir) and not os.listdir(temp_dir):
         os.rmdir(temp_dir)

if __name__ == "__main__":
   app.run(debug=True, port=5000)

   # if file_path.lower().endswith(('.mp4', '.mkv')):
   # video_text_data, video_audio_data = video_audio_text(file_path, interval_sec = 3)


   # if video_text_data is not None and video_audio_data is not None:
   #    video_data = f"Frame OCR Text: {video_text_data}\n Audio Transcribed: {video_audio_data}"
   #    final_video_prompt = VIDEO_TEXT.format(video_audio_data = video_data)
   # elif video_text_data is not None:
   #    final_video_prompt = VIDEO_TEXT.format(video_audio_data = video_text_data)
   # elif video_audio_data is not None:
   #    final_video_prompt = VIDEO_TEXT.format(video_audio_data=video_audio_data)

