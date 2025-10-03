# Using the official lightweight Node.js 20 image with Alpine Linux for smaller size
FROM node:20-alpine

# Setting the working directory inside the container to /app
WORKDIR /polysensor

# Copying both package.json and package-lock.json first for efficient Docker layer caching
COPY package.json package-lock.json ./

# Set npm to use the HTTP registry to avoid SSL/network issues
# Clean npm cache to avoid corrupted cache problems
# Upgrade npm to the latest version to get fixes and improvements
# Install exact dependencies as specified in package-lock.json with 'npm ci' for a clean install
RUN npm config set registry http://registry.npmjs.org/ && \
    npm cache clean --force && \
    npm install -g npm@latest && \
    npm ci

# Copy the rest of the application source code into the container
COPY . .

# Set an environment variable to clearly define the environment as development
ENV NODE_ENV=development

# Expose port 5173 (default port for Vite dev server) so it can be accessed outside the container
EXPOSE 5173

# Default command to run the dev server, listening on all network interfaces (0.0.0.0)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
