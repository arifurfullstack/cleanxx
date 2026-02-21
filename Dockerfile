# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json bun.lockb ./

# Install dependencies using bun
RUN npm install -g bun && bun install --frozen-lockfile

# Copy source code
COPY . .

# Build the app
RUN bun run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install a simple HTTP server to serve the static files
RUN npm install -g serve

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start the server
CMD ["serve", "-s", "dist", "-l", "3000"]
