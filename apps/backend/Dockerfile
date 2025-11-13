# Multi-stage build for NestJS Backend
FROM node:20-alpine AS builder

# Set working directory to mimic monorepo structure
WORKDIR /app

# Copy workspace root files
COPY package.json yarn.lock tsconfig.base.json ./

# Copy backend package.json
COPY apps/backend/package.json ./apps/backend/package.json

# Install all dependencies (yarn will resolve workspace)
WORKDIR /app
RUN yarn install --frozen-lockfile --network-timeout 600000

# Copy backend source code
COPY apps/backend/src ./apps/backend/src
COPY apps/backend/tsconfig.json ./apps/backend/tsconfig.json
COPY apps/backend/nest-cli.json ./apps/backend/nest-cli.json

# Build the backend
WORKDIR /app/apps/backend
RUN yarn build

# Production stage
FROM node:20-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Set working directory
WORKDIR /app

# Copy workspace root files
COPY package.json yarn.lock tsconfig.base.json ./

# Copy backend package.json
COPY apps/backend/package.json ./apps/backend/package.json

# Install production dependencies
RUN yarn install --frozen-lockfile --production --network-timeout 600000

# Copy built application from builder
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist

# Create keys directory (RSA keys will come from environment variables in Railway)
RUN mkdir -p ./apps/backend/keys

# Set working directory to backend
WORKDIR /app/apps/backend

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001 && \
    chown -R nestjs:nodejs /app

# Switch to non-root user
USER nestjs

# Expose port
EXPOSE 3000

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "dist/apps/backend/src/main.js"]
