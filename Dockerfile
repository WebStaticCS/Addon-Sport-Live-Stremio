# Use the official lightweight Node.js image
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Install dependencies
COPY package.json ./
RUN npm install --only=production

# Bundle app source
COPY . .

# Run the addon
CMD ["npm", "run", "start-addon"]