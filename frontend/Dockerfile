# Use lightweight Node.js 20 Alpine image
FROM node:20-alpine

# Set working directory
WORKDIR /polysensor

# Copy package files first for dependency caching
COPY package.json package-lock.json ./

# Install dependencies with npm cache for faster builds
# Use npm ci for clean, reproducible installs
RUN npm install

# Copy source code (node_modules is excluded via .dockerignore)
COPY . .

# Set environment
ENV NODE_ENV=development

# Expose Vite dev server port
EXPOSE 5173

# Run dev server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
