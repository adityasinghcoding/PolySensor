import os
from dotenv import load_dotenv
from prompts import JSON_DOCUMENT, AUDIO_TEXT, VIDEO_TEXT, IMAGE_TEXT
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from text_extractor import (unstructured_doc_extraction,
                            audio_text,
                            video_audio_text,
                            image_text
                            )

load_dotenv() # loading the environment variables from .env

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

if not GOOGLE_API_KEY:
   print("Enter the API key again!\n")
   GOOGLE_API_KEY = input()

llm = ChatGoogleGenerativeAI(model='gemini-2.5-pro', google_api_key = GOOGLE_API_KEY)

document_prompt = PromptTemplate(input_variables=['doc_json_data'], template=JSON_DOCUMENT)
audio_prompt = PromptTemplate(input_variables=['audio_data'], template=AUDIO_TEXT)
image_prompt = PromptTemplate(input_variables= ['image_data'], template=IMAGE_TEXT)
video_prompt = PromptTemplate(input_variables=['video_data'], template=VIDEO_TEXT)

document_chain = LLMChain(llm=llm, prompt = document_prompt)
image_chain = LLMChain(llm=llm, prompt = image_prompt)
audio_chain = LLMChain(llm=llm, prompt = audio_prompt)
video_chain = LLMChain(llm=llm, prompt = video_prompt)



if __name__ == "__main__":
   file_path = input("Give path of the file without '':\n")
   file_path = file_path.replace('"', '').strip()

   unstructured_doc_json_data = None
   audio_data = None
   image_data = None
   video_text_data = None
   video_audio_data = None

   extensions = (
   '.cwk', '.mcw', '.csv', '.dif', '.dbf', '.eml', '.msg', '.p7s', '.epub',
   '.htm', '.html', '.bmp', '.heic', '.prn', '.tiff',
   '.md', '.odt', '.org', '.eth', '.pbd', '.sdp', '.pdf', '.txt', '.pot',
   '.ppt', '.pptm', '.pptx', '.rst', '.rtf', '.et', '.fods', '.mw', '.xls',
   '.xlsx', '.sxg', '.tsv', '.abw', '.doc', '.docm', '.docx', '.dot', '.dotm',
   '.hwp', '.zabw', '.xml'
   )

   if file_path.lower().endswith(extensions):
      doc_json_data = unstructured_doc_extraction(file_path)
      
   if file_path.lower().endswith(('.mp3', '.wav', '.flac', '.aiff')):
      audio_data = audio_text(file_path)
      
   if file_path.lower().endswith(('.jpg', '.JPEG', '.png', '.PNG')):
      image_data = image_text(file_path)

   if file_path.lower().endswith(('.mp4', '.mkv')):
      video_text_data, video_audio_data = video_audio_text(file_path, interval_sec = 3)


   final_doc_prompt = ""
   final_audio_prompt = ""
   final_image_prompt = ""
   final_video_prompt = ""

   # plugging in the values(function outputs) to prompts to feed into llm 
   if unstructured_doc_json_data is not None:
      final_doc_prompt = JSON_DOCUMENT.format(doc_json_data = doc_json_data)

   if audio_data is not None:
      final_audio_prompt = AUDIO_TEXT.format(audio_data = audio_data)

   if image_data is not None:
      final_image_prompt = IMAGE_TEXT.format(image_data = image_data)

   if video_text_data is not None and video_audio_data is not None:
      video_data = f"Frame OCR Text: {video_text_data}\n Audio Transcribed: {video_audio_data}"
      final_video_prompt = VIDEO_TEXT.format(video_audio_data = video_data)
   elif video_text_data is not None:
      final_video_prompt = VIDEO_TEXT.format(video_audio_data = video_text_data)
   elif video_audio_data is not None:
      final_video_prompt = VIDEO_TEXT.format(video_audio_data=video_audio_data)


   # running feeding the output of functions with prompts to llm to get output
   if unstructured_doc_json_data is not None:
      llm_doc_output = document_chain.run(doc_json_data = final_doc_prompt)
      print(llm_doc_output)

   if audio_data is not None:
      llm_audio_output = audio_chain.run(audio_data = final_audio_prompt)
      print(llm_audio_output)

   if image_data is not None:
      llm_image_output = image_chain.run(image_data= final_image_prompt)
      print(llm_image_output)

   if video_audio_data is not None:
      llm_video_audio_output = video_chain.run(video_audio_data= final_video_prompt)
      print(llm_video_audio_output)