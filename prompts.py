JSON_DOCUMENT = '''
You're a helpful AI assistant. Give the following structured document data in JSON format,
provide a clear and concise summary highlighting the key points, main topic,
and any important details.

JSON Document Data: {json_data}

Please write the summary in a human-readable form.
'''

AUDIO_TEXT =  '''
You're a helpful intelligent AI assistant. 
Below is the transcription of audio from a video or audio source:

{audio_data}

Please analyze the content, summarize the key points, and provide any actionable insights.
You may also highlight unclear or ambiguous portions.

'''

VIDEO_TEXT = '''
You are an intelligent assistant. Below is combined extracted text from a video:

Video frame OCR text:
{video_data}

Audio transcription text:
{video_audio_data}

Please provide a detailed summary of the video, highlighting key points, themes, and any actionable insights.
If there are any unclear or ambiguous parts, mention them as well.

'''


