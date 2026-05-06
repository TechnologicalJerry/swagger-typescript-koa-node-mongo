# Use Node.js 20 LTS as base image
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Build the TypeScript code
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Set node env to production
ENV NODE_ENV production

# Copy package.json for production install
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["npm", "start"]
