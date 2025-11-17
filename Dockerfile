# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 80

# Serve the application
# Use --host to expose the server to the host machine
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "80"]