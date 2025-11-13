# Multi-stage build for React User Frontend
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy root package.json and yarn.lock
COPY ../../package.json ../../yarn.lock ./
COPY package.json ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN yarn build

# Production stage
FROM node:20-alpine AS production

# Install serve to serve static files
RUN npm install -g serve

# Set working directory
WORKDIR /app

# Copy built application from builder
COPY --from=builder /app/dist ./dist

# Create non-root user
RUN addgroup -g 1001 -S appuser && \
    adduser -S appuser -u 1001 -G appuser && \
    chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 8088

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:8088 || exit 1

# Start serve
CMD ["serve", "-s", "dist", "-l", "8088"]