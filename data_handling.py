import os
from unstructured.partition.auto import partition #Detects the file type
from unstructured.staging.base import elements_to_json # For converting/preparing the content into json
# import speech_recognition as sr
from pydub import AudioSegment
# import pytesseract as pt
# from PIL import Image
# import moviepy.editor as mpe
from moviepy.editor import VideoFileClip
# import numpy as np
# import tempfile
# import shutil



# Data Extraction
# def mp3_to_wav(mp3_file, wav_file):
    # mp3 = AudioSegment.from_mp3(mp3_file)
    # mp3.export(wav_file, format= "wav")

# def video_audio_text(video, interval_sec= 3):
    # temp_dir = tempfile.mkdtemp()

    # try:

    #     video_text_combined = [] # list for collecting the text from all(interval 3sec) frames of video

    #     video = mpe.VideoFileClip(video)
    #     # making the folder for the frames
    #     video_folder = os.path.splitext(os.path.basename(video.filename))[0] + "_frames"
    #     os.makedirs(video_folder, exist_ok=True)
    #     print(f"Extracting the frames every {interval_sec} seconds to folder: {video_folder}")

    #     timestamps = np.arange(0, video.duration, interval_sec)

    #     for i in timestamps:
    #         frame_path = os.path.join(video_folder, f"frame{int(i)}.jpg")
    #         video.save_frame(frame_path, i)
    #         print(f"Saved frame at {i}, seconds: {frame_path}")

    #         # Applying OCR on video frames
    #         frame = Image.open(frame_path)
    #         video_text = pt.image_to_string(frame)
    #         video_text_combined.append(video_text)
    #         # print(f"OCR Text at {i} seconds:\n {video_text}\n{"-"*30}")
    #         # return video_text
    #     video_text = "\n".join(video_text_combined)    


    #     # now processing the audio of video
    #     video_audio = f"{video.filename}_audio.wav"
    #     video.audio.write_audiofile(video_audio) #writing the audio file

    #     recognizer = sr.Recognizer()
        
    #     with sr.AudioFile(video_audio) as source:
    #         video_audio_record = recognizer.record(source)

    #     try:
    #         video_audio_text = recognizer.recognize_google(video_audio_record)
    #         # print("Extracted Text in audio of the video:\n", video_audio_text)
    #     except Exception as e:
    #         print(f"Speech Recognition Error: {e}")

    #     try:
    #         if not video_text:
    #             print("Text in video couldn't processed\n")

    #         if not video_audio_text:
    #             print("Text in Audio of video couldn't processed\n")
            
    #         return video_text, video_audio_text
        
    #     except Exception as e:
    #         print(f"Error in processing Video and Audio: {e}\n")
    # finally:
    #     shutil.rmtree(temp_dir)
        
# def audio_text(audio):
    # input_file = audio
    # try:
    #     if audio.lower().endswith('.mp3'): # renaming the wav
    #         wav_file = audio.rsplit('.', 1)[0] + '.wav'
    #         mp3_to_wav(audio, wav_file) # calling mp3_to_wav function to convert the mp3 into wav
    #         input_file = wav_file


    #     if audio.lower().endswith(('.wav', '.flac', '.aiff')):
    #         recognizer = sr.Recognizer()
    #         with sr.AudioFile(input_file) as source:
    #             audio_wav = recognizer.record(source)
    #         try:
    #             # Using the Google Speech Recognition
    #             audio_text = recognizer.recognize_google(audio_wav)
    #             # print("Audio Transcribbed\n", audio_text)
    #             return audio_text
    #         except sr.UnknownValueError: 
    #             print("Speech Recognition could not understand the audio!")
    #             return ""
    #         except sr.RequestError as e:
    #             print(f"Could not request results; {e}")
    #             return ""
    # except Exception as e:
    #     print(f"Error loading file: {e}")

# def image_text(image):
    # image = os.path.normpath(image)
    # # Check if the file exists
    # if not os.path.exists(image):
    #     print(f"File does not exist: {image}")
    #     return ""    
          
    # try:
    #     # if the result list (from partition), convert to json and show both
    #     if image.lower().endswith(('.jpg', '.jpeg', '.png', '.webp', '.heif')):
    #         img = Image.open(image)
    #         img_text = pt.image_to_string(img)
    #         # print("\n", img_text)
    #         return img_text
    # except Exception as e:
    #     print(f"Error loading {image}\n {e}")

# Preprocessing(validating) before feeding the raw data directly to LLM

def audio(audio):
    audio = os.path.normpath(audio)
    if not os.path.exists(audio):
        print(f"File doesn't exist, recheck the given file path: {audio}!\n")
        return ""

    # Limiting video length
    try:
        audio = AudioSegment.from_file(audio)
        if len(audio) > 60*1000:  # 1 min audio length limit, pydub works on milliseconds fundamentally so feeding accordingly
            in_minute = len(audio) / 1000
            in_minute = in_minute / 60
            limit_message = f"Audio length is {in_minute:.2f} min which exceeds 1 minute.\n" \
            "For longer audio input think once to subscribe our monthly premium!"
            return limit_message
        else:
            return audio

    except Exception as e:
        print(f"Audio: {audio} is not supported\n {e}")
        return ""

def image(image):
    image = os.path.normpath(image)
    if not os.path.exists(image):
        print(f"File doesn't exist, recheck the given file path: {image}!\n")
        return ""
    else:
       return image

def video(video):
    video = os.path.normpath(video)
    if not os.path.exists(video):
        print(f"File doesn't exist, recheck the given file path: {video}!\n")
        return ""
    
    # Limiting video length
    try:
        with VideoFileClip(video) as clip:
            if clip.duration > 30:  # 30 sec video length limit
                limit_message = f"Video length is {clip.duration} which exceeds 30 seconds.\n" \
                "For longer video input think once to subscribe our monthly premium!"
                return limit_message
            else:
                return video
            
    except Exception as e:
        print(f"Video: {video} is not supported\n {e}")
        return ""


def unstructured_doc_extraction(doc):

    # Normalize the file path to handle special characters
    doc = os.path.normpath(doc)
    # Check if the file exists
    if not os.path.exists(doc):
        print(f"File does not exist: {doc}")
        return ""
            
    try:
        unstructured_doc = partition(filename=doc)
        # print("File Loaded\n")

        all_content = []
        if isinstance(unstructured_doc, list):
            json_output = elements_to_json(unstructured_doc)
            # print("Json Output: \n")
            # print(json_output)
            # print("\n Text Content:\n")

            # converting the items which are in object in partition form into string
            for items_objects in unstructured_doc:
                try:
                    items_string = str(items_objects)
                    if items_string:
                        # print(items)
                        all_content.append(items_string)
                        return all_content
                    else:
                        print("Failed to convert list into string\n")
                except Exception:
                    continue        

        elif isinstance(unstructured_doc, str): # Audio text or error
            # print("\n\n", unstructured_doc)
            return unstructured_doc
        else:
            print("No extractable content.\n")

    except Exception as e:
        print(f"Error loading file: {e}")

