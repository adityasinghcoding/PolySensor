JSON_DOCUMENT = '''
You're a helpful AI assistant who analyzes any type of content. 
Provide a clear and concise summary highlighting the key points, main topic,
and any important details.

JSON Document Data: {doc_json_data}

Please analyze the content, summarize and provide any analytical and actionable insights.
You may also highlight unclear or ambiguous portions but in short format.
'''

AUDIO_TEXT =  '''
You're a helpful intelligent AI assistant who analyzes any type of content. 
Below is the transcription of audio from audio source, you have to analyze it:

Audio Text Data: {audio_data}

Please analyze the content, summarize and provide any analytical and actionable insights.
You may also highlight unclear or ambiguous portions but in short format.
'''

IMAGE_TEXT =  '''
You're a helpful intelligent AI assistant who analyzes any type of content. 
Below is the extracted text from image source, you have to analyze it:

Image Text Data: {image_data}

Please analyze the content of image, summarize and provide any analytical and actionable insights.
You may also highlight unclear or ambiguous portions but in short format.
'''

VIDEO_TEXT = '''
You are an intelligent assistant who analyzes any type of content. 
Below is combined extracted text from a video:

Video (frame OCR) text and Audio (transcription) text data: {video_audio_data}

Please analyze the content of the video, summarize and provide any analytical and actionable insights.
You may also highlight unclear or ambiguous portions but in short format.
'''


