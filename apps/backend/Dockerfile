# Multi-stage build for NestJS Backend
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy backend package.json and yarn.lock from root
COPY apps/backend/package.json ./package.json
COPY yarn.lock ./yarn.lock

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy backend source code
COPY apps/backend/src ./src
COPY apps/backend/tsconfig.json ./tsconfig.json
COPY apps/backend/nest-cli.json ./nest-cli.json

# Build the application
RUN yarn build

# Production stage
FROM node:20-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Set working directory
WORKDIR /app

# Copy package files
COPY apps/backend/package.json ./package.json
COPY yarn.lock ./yarn.lock

# Install only production dependencies
RUN yarn install --frozen-lockfile --production

# Copy built application from builder
COPY --from=builder /app/dist ./dist

# Copy RSA keys (if they exist)
COPY apps/backend/keys ./keys

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001 && \
    chown -R nestjs:nodejs /app

# Switch to non-root user
USER nestjs

# Expose port
EXPOSE 8830

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8830/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "dist/main.js"]
