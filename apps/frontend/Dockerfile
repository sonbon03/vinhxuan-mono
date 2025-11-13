# Multi-stage build for React Admin Frontend
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy root package.json and yarn.lock
COPY package.json yarn.lock ./
COPY apps/frontend/package.json ./apps/frontend/

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy frontend source code
COPY apps/frontend ./apps/frontend

# Build the frontend application
WORKDIR /app/apps/frontend
RUN yarn build

# Production stage
FROM node:20-alpine AS production

# Install serve to serve static files
RUN npm install -g serve

# Set working directory
WORKDIR /app

# Copy built application from builder
COPY --from=builder /app/apps/frontend/dist ./dist

# Create non-root user
RUN addgroup -g 1001 -S appuser && \
    adduser -S appuser -u 1001 -G appuser && \
    chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000 || exit 1

# Start serve
CMD ["serve", "-s", "dist", "-l", "3000"]
