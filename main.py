import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain_core.messages import HumanMessage
import base64
import getpass
from prompts import DOCUMENT_PROMPT, AUDIO_PROMPT, VIDEO_PROMPT, IMAGE_PROMPT
from data_handling import (
   unstructured_doc_extraction,
   # audio_text,
   # video_audio_text,
   audio,
   image,
   video
   )


load_dotenv() # loading the environment variables from .env

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

if not GOOGLE_API_KEY:
   GOOGLE_API_KEY = getpass.getpass("Enter API Key:")
   os.environ["GOOGLE_API_KEY"] = GOOGLE_API_KEY

llm = ChatGoogleGenerativeAI(model='gemini-2.5-pro', google_api_key = GOOGLE_API_KEY)

document_prompt = PromptTemplate(input_variables=['doc_json_data'], template=DOCUMENT_PROMPT)
# audio_prompt = PromptTemplate(input_variables=['audio_data'], template=AUDIO_PROMPT)
# image_prompt = PromptTemplate(input_variables= ['image_data'], template=IMAGE_PROMPT)
# video_prompt = PromptTemplate(input_variables=['video_data'], template=VIDEO_PROMPT)

document_chain = LLMChain(llm=llm, prompt = document_prompt)
# image_chain = LLMChain(llm=llm, prompt = image_prompt)
# audio_chain = LLMChain(llm=llm, prompt = audio_prompt)
# video_chain = LLMChain(llm=llm, prompt = video_prompt)



if __name__ == "__main__":
   file_path = input("Give path of the file:\n")
   file_path = file_path.replace('"', '').strip()

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

   # video_text_data = None
   # video_audio_data = None
   doc_json_data = None

   if file_path.lower().endswith(doc_extensions):
      doc_json_data = unstructured_doc_extraction(file_path)
      if doc_json_data:
         # plugging in the values(function outputs) to prompts to feed into llm 
         final_doc_prompt = DOCUMENT_PROMPT.format(doc_json_data = doc_json_data)
         
         # running; feeding the output of functions with prompts to llm to get output
         llm_doc_output = document_chain.run(doc_json_data=final_doc_prompt)
         print(llm_doc_output)


   if file_path.lower().endswith(image_extensions):
      image_path = image(file_path)
      if image_path:
         # Reading image bytes
         with open(image_path, "rb") as img:
            image_bytes = img.read()
            prompt_with_image = HumanMessage(
               content= [
                  {
                     'type': 'text',
                     'text': IMAGE_PROMPT
                     },
                  {
                     'type': 'image_url', 
                     'image_url': f"data:image/png;base64, {base64.b64encode(image_bytes).decode('utf-8')}"
                  }
               ]
            )
            # Feeding the audio with prompt using json format of langchain
            final_image_prompt = llm.invoke([prompt_with_image])
            print(final_image_prompt.content)
      
   if file_path.lower().endswith(audio_extensions):
      audio_path = audio(file_path)
      if audio_path:
         with open(audio_path, "rb") as aud:
            audio_bytes = aud.read()
            prompt_with_audio = HumanMessage([
            {
               'type': 'text',
               'text': AUDIO_PROMPT
            },
            {
               'type': 'audio_url', 
               'audio_url': f'data:audio/mp3;base64, {base64.b64encode(audio_bytes).decode('utf-8')}'
            }
               ]
            )
            # Feeding the audio with prompt using json format of langchain
            final_audio_prompt = llm.invoke([prompt_with_audio])
            print(final_audio_prompt.content)


   if file_path.lower().endswith(video_extensions):
      video_path = video(file_path)
      if video_path:
         with open(video_path, "rb") as vid:
            video_bytes = vid.read()
            prompt_with_video = HumanMessage([
            {
               'type': 'text',
               'text': VIDEO_PROMPT
            },
            {
               'type': 'video_url', 
               'video_url': f'data:video/mp4;base64, {base64.b64encode(video_bytes).decode('utf-8')}'
            }
               ]
            )        
            # Feeding the audio with prompt using json format of langchain
            final_video_prompt = llm.invoke([prompt_with_video])
            print(final_video_prompt.content)

   # if file_path.lower().endswith(('.mp4', '.mkv')):
   # video_text_data, video_audio_data = video_audio_text(file_path, interval_sec = 3)


   # if video_text_data is not None and video_audio_data is not None:
   #    video_data = f"Frame OCR Text: {video_text_data}\n Audio Transcribed: {video_audio_data}"
   #    final_video_prompt = VIDEO_TEXT.format(video_audio_data = video_data)
   # elif video_text_data is not None:
   #    final_video_prompt = VIDEO_TEXT.format(video_audio_data = video_text_data)
   # elif video_audio_data is not None:
   #    final_video_prompt = VIDEO_TEXT.format(video_audio_data=video_audio_data)

