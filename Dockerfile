# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy all files
COPY package.json package-lock.json bun.lockb* ./

# Install dependencies - use npm first, fall back to bun
RUN npm ci --prefer-offline --no-audit || (npm install -g bun && bun install --frozen-lockfile)

# Copy source code
COPY . .

# Build the app
RUN npm run build || (npm install -g bun && bun run build)

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install serve to serve static files
RUN npm install -g serve

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Expose port 3000
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/ || exit 1

# Start the application
CMD ["serve", "-s", "dist", "-l", "3000"]
