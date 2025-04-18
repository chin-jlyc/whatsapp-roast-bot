FROM node:22.11.0-slim

# Install dependencies for Puppeteer
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Set environment variables for Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Create app directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy app source
COPY . .

# Create directory for WhatsApp session data
RUN mkdir -p .wwebjs_auth

# Set volume for persistent WhatsApp session
VOLUME ["/usr/src/app/.wwebjs_auth"]

# Start the bot
CMD ["node", "src/index.js"]
