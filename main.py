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
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.platypus import Table, TableStyle, Paragraph, SimpleDocTemplate, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.units import inch
# import mimetypes
from flask import Flask, request, jsonify, session, send_from_directory, send_file
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

polysensor = Flask(__name__)
polysensor.secret_key = os.getenv("FLASK_SECRET_KEY", "supersecretkey")  # Set a secret key for session management
CORS(polysensor, resources={r"/*": {"origins": ["http://localhost:5173", "http://localhost:5174"]}})  # allow frontend origins


@polysensor.route('/chat', methods=['POST'])
def chat_llm():
   try:
      # initializing chat history
      session.setdefault('chat_history', [])
      user_query = request.json.get('query')

      # Adding user messages to history(list)
      session['chat_history'].append({'role': 'user', 'question': user_query})

      # llm response on user query
      llm_reply = llm.invoke(user_query)
      session['chat_history'].append({'role': 'llm', 'answer': llm_reply.content})

      # sending full history to frontend
      return jsonify({'chats': session['chat_history']})
   except Exception as e:
      return jsonify({'error': str(e)}), 500



@polysensor.route('/analyze0', methods=['POST'])
def analyze_file():
   file_path = None
   try:
      if 'file' not in request.files:
         return jsonify({'error': 'No file provided'}), 400

      global file

      file = request.files['file']
      if file.filename == '':
         return jsonify({'error': 'No file selected'}), 400

      # saving file temporarily
      temp_dir = os.path.join(os.getcwd(), 'temp')
      if not os.path.exists(temp_dir):
          os.makedirs(temp_dir, exist_ok=True)
      file_path = os.path.join(temp_dir, file.filename)
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
            return jsonify({'error': 'Image file not found after processing'}), 400
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
      # Cleanup temp file after processing, keep temp folder permanent
      if file_path and os.path.exists(file_path):
         os.remove(file_path)

# New endpoint for PDF export
@polysensor.route('/export-pdf', methods=['POST'])
def export_pdf():
    try:
        data = request.get_json()
        content = data.get('content', '')
        filename = data.get('filename', 'analysis')
        count = data.get('count', 1)

        import re
        from reportlab.lib.colors import HexColor
        from reportlab.pdfbase.pdfmetrics import stringWidth

        def clean_content(content):
            """Remove boilerplate phrases from analysis content."""
            unwanted_phrases = [
                "Analysis on textual information has finished and here are the results:",
                "Analysis on audio information has finished and here are the results:",
                "Analysis on image information has finished and here are the results:",
                "Analysis on video information has finished and here are the results:"
            ]
            lines = content.split('\n')
            cleaned_lines = []
            for line in lines:
                if not any(phrase.lower() in line.strip().lower() for phrase in unwanted_phrases):
                    cleaned_lines.append(line)
            return '\n'.join(cleaned_lines)

        def sanitize_for_paragraph(text):
            # Replace **bold** with <b>bold</b> for ReportLab Paragraph
            text = re.sub(r'\*\*(.*?)\*\*', r'<b>\1</b>', text)
            # Remove pipe characters for non-table text
            text = re.sub(r'\|', '', text)
            return text

        def sanitize_for_table_cell(text):
            # For table cells, only handle bold, no pipe removal
            text = re.sub(r'\*\*(.*?)\*\*', r'<b>\1</b>', text)
            return text

        # Custom modern styles with premium theme colors
        def create_custom_styles():
            styles = getSampleStyleSheet()
            # Premium title style - softer blue
            title_style = ParagraphStyle(
                'ModernTitle',
                parent=styles['Heading1'],
                fontSize=26,
                spaceAfter=40,
                textColor=HexColor('#3498db'),  # Modern blue
                alignment=1,  # TA_CENTER
                fontName='Helvetica-Bold'
            )
            # Premium heading style - medium grey-blue
            heading_style = ParagraphStyle(
                'ModernHeading',
                parent=styles['Heading2'],
                fontSize=18,
                spaceAfter=15,
                spaceBefore=15,
                textColor=HexColor('#2c3e50'),  # Darker but softer grey-blue
                fontName='Helvetica-Bold'
            )
            # Premium normal style
            normal_style = ParagraphStyle(
                'ModernNormal',
                parent=styles['Normal'],
                fontSize=11,
                spaceAfter=8,
                leading=14,
                textColor=HexColor('#34495e'),
                fontName='Helvetica'
            )
            # Table cell style
            table_cell_style = ParagraphStyle(
                'TableCell',
                parent=styles['Normal'],
                fontSize=10,
                spaceAfter=4,
                leading=12,
                textColor=HexColor('#2c3e50'),
                fontName='Helvetica',
                alignment=0,  # TA_LEFT
                leftIndent=0,
                rightIndent=0
            )
            # Table header style - white text for blue background
            table_header_style = ParagraphStyle(
                'TableHeader',
                parent=styles['Normal'],
                fontSize=11,
                textColor=colors.white,
                fontName='Helvetica-Bold',
                alignment=0,  # TA_LEFT
                leftIndent=0,
                rightIndent=0
            )
            styles.add(title_style)
            styles.add(heading_style)
            styles.add(normal_style)
            styles.add(table_cell_style)
            styles.add(table_header_style)
            return styles

        # Function to detect and parse Markdown tables anywhere
        def find_and_parse_tables(lines, i, styles):
            # Look for table start: header row with |
            while i < len(lines):
                line = lines[i].strip()
                if line.startswith('|') and '|' in line[1:]:
                    # Potential header
                    headers_raw = [h.strip() for h in line.split('|') if h.strip()]
                    if len(headers_raw) > 1:
                        i += 1
                        # Check for separator
                        if i < len(lines):
                            sep_line = lines[i].strip()
                            if '---' in sep_line and sep_line.startswith('|'):
                                i += 1
                                # Collect rows
                                rows = []
                                while i < len(lines):
                                    row_line = lines[i].strip()
                                    if row_line.startswith('|') and '---' not in row_line:
                                        cells_raw = [cell.strip() for cell in row_line.split('|') if cell.strip()]
                                        if len(cells_raw) == len(headers_raw):
                                            cells = [sanitize_for_table_cell(cell) for cell in cells_raw]
                                            rows.append([Paragraph(cell, styles['TableCell']) for cell in cells])
                                        i += 1
                                    else:
                                        break
                                if rows:  # At least one row
                                    headers = [sanitize_for_table_cell(h) for h in headers_raw]
                                    header_row = [Paragraph(h, styles['TableHeader']) for h in headers]
                                    # Calculate equal column widths
                                    num_cols = len(headers)
                                    content_width = 468  # letter width 612 - 72*2 margins
                                    col_widths = [content_width / num_cols] * num_cols
                                    table = Table([header_row] + rows, colWidths=col_widths)
                                    table.setStyle(TableStyle([
                                        # Premium table styling
                                        ('BACKGROUND', (0, 0), (-1, 0), HexColor('#3498db')),
                                        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
                                        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                                        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                                        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                                        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
                                        ('FONTSIZE', (0, 0), (-1, 0), 11),
                                        ('FONTSIZE', (0, 1), (-1, -1), 10),
                                        ('BOTTOMPADDING', (0, 0), (-1, 0), 10),
                                        ('TOPPADDING', (0, 0), (-1, 0), 10),
                                        ('BACKGROUND', (0, 1), (-1, -1), colors.white),
                                        ('GRID', (0, 0), (-1, -1), 0.5, HexColor('#bdc3c7')),  # Light grey
                                        ('LEFTPADDING', (0, 0), (-1, -1), 8),
                                        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
                                        ('TOPPADDING', (0, 1), (-1, -1), 6),
                                        ('BOTTOMPADDING', (0, 1), (-1, -1), 6),
                                    ]))
                                    story.append(table)
                                    story.append(Spacer(1, 15))
                                    return i  # Continue from here
                i += 1
            return i

        # Enhanced Markdown parser
        def parse_markdown_content(content, styles):
            content = clean_content(content)
            lines = content.split('\n')
            i = 0
            while i < len(lines):
                line = lines[i].lstrip()
                if not line:
                    i += 1
                    continue

                # Handle headings ## or ###
                if line.startswith('###'):
                    clean_heading = line[4:].strip()
                    sanitized_heading = sanitize_for_paragraph(clean_heading)
                    if sanitized_heading:
                        p = Paragraph(sanitized_heading, styles['ModernHeading'])
                        story.append(p)
                    i += 1
                    continue
                elif line.startswith('##'):
                    clean_heading = line[3:].strip()
                    sanitized_heading = sanitize_for_paragraph(clean_heading)
                    if sanitized_heading:
                        p = Paragraph(sanitized_heading, styles['ModernHeading'])
                        story.append(p)
                    i += 1
                    continue

                # Detect and parse tables anywhere
                i = find_and_parse_tables(lines, i, styles)
                if i >= len(lines):
                    break

                # Regular text
                if not line.startswith('|'):
                    sanitized_line = sanitize_for_paragraph(line)
                    if sanitized_line:
                        p = Paragraph(sanitized_line, styles['ModernNormal'])
                        story.append(p)
                i += 1

        # Footer function for all pages
        def add_footer(canvas, doc):
            canvas.saveState()
            canvas.setFont('Helvetica-Oblique', 8)
            canvas.setFillColor(HexColor('#bdc3c7'))
            text = "Generated by PolySensor - Advanced AI Analysis Platform"
            text_width = stringWidth(text, 'Helvetica-Oblique', 8)
            x = (612 - text_width) / 2  # Center on letter width
            canvas.drawString(x, 30, text)
            canvas.restoreState()

        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter, rightMargin=72, leftMargin=72, topMargin=72, bottomMargin=72)
        styles = getSampleStyleSheet()
        story = []

        # Use custom styles
        styles = create_custom_styles()

        # Add premium title with branding
        if filename:
            title_text = f"<b>Analysis Report: {filename}</b><br/><font size=10 color='#7f8c8d'>Generated by PolySensor</font>"
            title = Paragraph(title_text, styles['ModernTitle'])
            story.append(title)
            story.append(Spacer(1, 30))

        parse_markdown_content(content, styles)

        doc.build(story, onFirstPage=add_footer, onLaterPages=add_footer)
        buffer.seek(0)

        return send_file(buffer, as_attachment=True, download_name=f'{filename}_analysis_report_{count}.pdf', mimetype='application/pdf')
    except Exception as e:
        print(f"PDF generation error: {str(e)}")  # Log error for debugging
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
   port = int(os.environ.get('PORT', 5000))
   polysensor.run(host='0.0.0.0', port=port, debug=True)

   # if file_path.lower().endswith(('.mp4', '.mkv')):
   # video_text_data, video_audio_data = video_audio_text(file_path, interval_sec = 3)


   # if video_text_data is not None and video_audio_data is not None:
   #    video_data = f"Frame OCR Text: {video_text_data}\n Audio Transcribed: {video_audio_data}"
   #    final_video_prompt = VIDEO_TEXT.format(video_audio_data = video_data)
   # elif video_text_data is not None:
   #    final_video_prompt = VIDEO_TEXT.format(video_audio_data = video_text_data)
   # elif video_audio_data is not None:
   #    final_video_prompt = VIDEO_TEXT.format(video_audio_data=video_audio_data)

