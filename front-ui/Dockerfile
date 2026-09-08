FROM node:14

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Copy the rest of the application code
COPY . .

# Install dependencies
RUN npm install
# Install http-server globally
RUN npm install -g http-server

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the production server
CMD ["http-server", "dist", "-p", "5000", "-c-1", "--cors"]