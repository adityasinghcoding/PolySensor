DOCUMENT_PROMPT = '''
JSON Document Data: {doc_json_data}

You're a helpful AI assistant who analyzes any type of content. 
Provide a clear and concise summary highlighting the key points, main topic,
and any important details.

Please analyze the content, summarize and provide any analytical and actionable insights.
You may also highlight unclear or ambiguous portions but in short format.
'''

IMAGE_PROMPT = '''
Analyze the image and provide concise professional insights and   
summarize the overall theme, quality, and mood in short form, clear sentences.

Then, present a table of technical details for the image with columns for:
- Resolution
- Color grading and dominant palette
- Lighting type and quality
- Camera parameters (if detectable)
- Framing and composition style
- Image sharpness and noise
- Aspect ratio
- File format, etc

If applicable, note any advanced editing or post-processing techniques detected.

Finish with key strengths and potential areas for technical improvement in short form in tabular format.

'''

AUDIO_PROMPT = '''
Analyze this audio and provide insights in professionally and analytical format in short."

'''

VIDEO_PROMPT = '''
Analyze this video and provide insights in professionally and analytical format in short."

'''


# AUDIO_TEXT =  '''
# Audio: {audio_data}

# You're a helpful intelligent AI assistant who analyzes any type of content. 
# Below is the transcription of audio from audio source, you have to analyze it:

# Please analyze the content, summarize and provide any analytical and actionable insights.
# You may also highlight unclear or ambiguous portions but in short format.
# '''

# IMAGE_TEXT =  '''
# Image: {image_data}

# You're a helpful intelligent AI assistant who analyzes any type of content. 
# Below is the extracted text from image source, you have to analyze it:

# Please analyze the content of image, summarize and provide any analytical and actionable insights.
# You may also highlight unclear or ambiguous portions but in short format.
# '''

# VIDEO_TEXT = '''
# Video: {video_data}

# You are an intelligent assistant who analyzes any type of content. 
# Below is combined extracted text from a video:

# Please analyze the content of the video, summarize and provide any analytical and actionable insights.
# You may also highlight unclear or ambiguous portions but in short format.
# '''


