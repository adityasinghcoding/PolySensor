# Use the official Python 3.11 slim image as the base image
FROM python:3.11-slim

# Set the working directory inside the container
WORKDIR /polysensor

# Install system dependencies in a single layer for better caching
# Only rebuild this layer if system dependencies change
# RUN apt-get update && apt-get install -y --no-install-recommends \
#     build-essential \
#     libssl-dev \
#     libffi-dev \
#     python3-dev \
#     && rm -rf /var/lib/apt/lists/*

# Copy requirements.txt first for dependency caching
COPY requirements.txt .

# Install Python dependencies with pip cache for faster builds
# Use --no-cache-dir to avoid storing cache in the image
RUN pip install -r requirements.txt

# Copy only necessary source files (exclude files via .dockerignore)
# This layer will be rebuilt only when source code changes
COPY . .

# Expose port 5000
EXPOSE 5000

# Run the application
CMD ["python", "main.py"]
