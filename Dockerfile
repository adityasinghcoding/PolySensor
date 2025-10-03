# Using the official Python 3.11 slim image as the base image
# "slim" means it is a smaller image with only essential components
FROM python:3.11-slim 

# Setting working directory inside the container to /polysensor
# Docker will create this directory automatically if it doesn't exist
WORKDIR /polysensor

# Copying the requirements.txt file from your local machine to the container
COPY requirements.txt .

# Installing Python dependencies listed in requirements.txt without using the pip cache
RUN pip install --no-cache-dir -r requirements.txt

# Copying the rest of the backend source code from the project folder into the container
COPY . .

# Expososing on port 5000 – the default port Flask listens on – to allow external access
EXPOSE 5000

# Seting an environment variable to tell Flask what the application entry point file is
# ENV FLASK_APP=app.py  # Removed because main.py is the entry point and not using flask CLI

# Define the default command to run when the container starts
# This will run Flask app using the Python interpreter
CMD ["python", "main.py"]
