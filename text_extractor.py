import os
from unstructured.partition.auto import partition #Detects the file type
from unstructured.staging.base import elements_to_json # For converting/preparing the content into json
import speech_recognition as sr
from pydub import AudioSegment
import pytesseract as pt
from PIL import Image
import moviepy.editor as mpe
import numpy as np

from prompts import JSON_DOCUMENT, AUDIO_TEXT, VIDEO_TEXT


def mp3_to_wav(mp3_file, wav_file):
    mp3 = AudioSegment.from_mp3(mp3_file)
    mp3.export(wav_file, format= "wav")

def video_audio_text(video, interval_sec= 3):
    video = mpe.VideoFileClip(video)
    # making the folder for the frames
    video_folder = os.path.splitext(os.path.basename(video.filename))[0] + "_frames"
    os.makedirs(video_folder, exist_ok=True)
    print(f"Extracting the frames every {interval_sec} seconds to folder: {video_folder}")

    timestamps = np.arange(0, video.duration, interval_sec)

    for i in timestamps:
        frame_path = os.path.join(video_folder, f"frame{int(i)}.jpg")
        video.save_frame(frame_path, i)
        print(f"Saved frame at {i}, seconds: {frame_path}")

        # Applying OCR on video frames
        frame = Image.open(frame_path)
        ocr_text = pt.image_to_string(frame)
        print(f"OCR Text at {i} seconds:\n {ocr_text}\n{"-"*30}")


    # now processing the audio of video
    video_audio = "temp_audio.wav"
    video.audio.write_audiofile(video_audio) #writing the audio file

    recognizer = sr.Recognizer()
    
    with sr.AudioFile(video_audio) as source:
        video_audio_record = recognizer.record(source)

    try:
        video_audio_text = recognizer.recognize_google(video_audio_record)
        print("Extracted Text in audio of the video:\n", video_audio_text)
    except Exception as e:
        print(f"Speech Recognition Error: {e}")

def audio_text(audio):
    try:
        if audio.lower().endswith('.mp3'): # renaming the wav
            wav_file = audio.rsplit('.', 1)[0] + '.wav'
            mp3_to_wav(audio, wav_file) # calling mp3_to_wav function to convert the mp3 into wav
            input_file = wav_file


        if audio.lower().endswith(('.wav', '.flac', '.aiff')):
            recognizer = sr.Recognizer()
            with sr.AudioFile(input_file) as source:
                audio_data = recognizer.record(source)
            try:
                # Using the Google Speech Recognition
                audio_text = recognizer.recognize_google(audio_data)
                print("Audio Transcribbed\n", audio_text)
                # return audio_text
            except sr.UnknownValueError: 
                print("Speech Recognition could not understand the audio!")
                return ""
            except sr.RequestError as e:
                print(f"Could not request results; {e}")
                return ""
    except Exception as e:
        print(f"Error loading file: {e}")


def text_extraction(input_file):
    # Normalize the file path to handle special characters
    input_file = os.path.normpath(input_file)
    # Check if the file exists
    if not os.path.exists(input_file):
        print(f"File does not exist: {input_file}")
        return
            
    try:
        if input_file.lower().endswith(('.mp4', '.mkv')):
            print("Processing the audio and video...\n")
            video_audio_text(input_file, interval_sec=3)

            # if the result list (from partition), convert to json and show both
        if input_file.lower().endswith(('.jpg', '.JPEG', '.jpeg', '.PNG', '.png')):
            img = Image.open(input_file)
            img_text = pt.image_to_string(img)
            print("\n", img_text)

        elif not input_file.lower().endswith(('.mp3', '.wav', '.mp4', '.mkv')):
            text = partition(filename=input_file)
            print("File Loaded\n")

            if isinstance(text, list):
                json_output = elements_to_json(text)
                print("Json Output: \n")
                print(json_output)

                print("\n Text Content:\n")

                # converting the items which are in object in partition form into string
                for items_objects in text:
                    try:
                        items = str(items_objects)
                        if items:
                            print(items)
                    except Exception:
                        continue        

            elif isinstance(text, str): # Audio text or error
                print("\n\n", text)
            else:
                print("No extractable content or error occurred.\n")
    
    except Exception as e:
        print(f"Error loading file: {e}")
                

if __name__ == "__main__":
    file_path = input("Give path of the file without '':\n")
    file_path = file_path.replace('"', '').strip()

    text_json_data = None
    audio_data = None
    video_audio_data = None

    if not file_path.lower().endswith(('.mp3', '.wav', '.flac', '.aiff', '.mp4', '.mkv')):
        text_json_data = text_extraction(file_path)
        
    if file_path.lower().endswith(('.mp3', '.wav', '.flac', '.aiff')):
        audio_data = audio_text(file_path)

    if file_path.lower().endswith(('.mp4', '.mkv')):
        video_audio_data = video_audio_text(file_path, interval_sec = 3)

# plugging in the values(function outputs) to prompts to feed into llm 
if text_json_data is not None:
    JSON_DOCUMENT.format(json_data = text_json_data)

if audio_data is not None:
    AUDIO_TEXT.format(audio_data = audio_data)

if video_audio_data is not None:
    VIDEO_TEXT.format(video_audio_data = video_audio_data)

