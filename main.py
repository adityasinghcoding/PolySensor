import os
from dotenv import load_dotenv
from prompts import JSON_DOCUMENT, AUDIO_TEXT, VIDEO_TEXT, IMAGE_TEXT
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from text_extractor import (final_audio_prompt, final_doc_prompt, final_image_prompt, final_video_prompt,
                            unstructured_doc_json_data, audio_data, video_audio_data, image_data)

load_dotenv() # loading the environment variables from .env

print("Enter the API key:\n")

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

# running feeding the output of functions with prompts to llm to get output
if unstructured_doc_json_data is not None:
   llm_doc_output = document_chain.run(doc_json_data = final_doc_prompt)
   print(llm_doc_output)

if audio_data is not None:
   llm_audio_output = audio_chain.run(audio_data = final_audio_prompt)
   print(llm_audio_output)

if image_data is not None:
   llm_image_output = video_chain.run(image_data= final_image_prompt)
   print(llm_image_output)

if video_audio_data is not None:
   llm_video_audio_output = video_chain.run(video_audio_data= final_video_prompt)
   print(llm_video_audio_output)

