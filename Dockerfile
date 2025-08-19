# Use Node.js base image
FROM node:18-alpine

# Setting working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copying rest of the app
COPY . .

# Expose port
EXPOSE 3000

# Run server
CMD ["npm", "start"]

