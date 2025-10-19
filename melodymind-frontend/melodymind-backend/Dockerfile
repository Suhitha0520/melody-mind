# Use a Node base image with Python included
FROM node:18-bullseye

# Install Python 3.9, pip, and ffmpeg
RUN apt-get update && apt-get install -y python3 python3-pip ffmpeg && \
    ln -s /usr/bin/python3 /usr/bin/python

# Set working directory
WORKDIR /app

# Copy package.json and install Node dependencies
COPY package.json .
RUN npm install

# Copy requirements.txt and install Python dependencies
COPY requirements.txt .
RUN pip3 install -r requirements.txt

# Copy all backend files
COPY . .

# Expose port
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]
