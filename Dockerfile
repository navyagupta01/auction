# Multi-stage build for React + Node.js
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Build React frontend first
COPY client/package*.json ./client/
WORKDIR /app/client
RUN npm install

COPY client/ ./
RUN npm run build

# Setup Node.js backend
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install --production

COPY server/ ./

# Copy built React app to server's public directory
RUN mkdir -p /app/server/public
RUN cp -r /app/client/build/* /app/server/public/

# Expose port
EXPOSE 5000

# Start the application
CMD ["node", "server.js"]
