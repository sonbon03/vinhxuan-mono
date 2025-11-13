# Multi-stage build for NestJS Backend
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy workspace configuration files (build context is vinhxuan-cms root)
COPY package.json yarn.lock tsconfig.base.json ./

# Create workspace structure
RUN mkdir -p packages/shared apps/backend

# Copy shared package completely (all files needed for workspace resolution)
COPY packages/shared ./packages/shared/

# Copy backend package.json for dependency resolution
COPY apps/backend/package.json ./apps/backend/package.json

# Install ALL dependencies (including workspace dependencies)
# Yarn will resolve @vinhxuan/shared from the workspace
RUN yarn install --frozen-lockfile

# Now copy the actual backend source code
COPY apps/backend ./apps/backend

# Build the backend application
WORKDIR /app/apps/backend
RUN yarn build

# Production stage
FROM node:20-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Set working directory
WORKDIR /app

# Copy workspace configuration files
COPY package.json yarn.lock tsconfig.base.json ./

# Create workspace structure
RUN mkdir -p packages/shared apps/backend

# Copy workspace packages (needed for production dependencies resolution)
COPY packages/shared ./packages/shared/

# Copy backend package.json
COPY apps/backend/package.json ./apps/backend/package.json

# Install only production dependencies (yarn will resolve workspace deps)
RUN yarn install --frozen-lockfile --production

# Copy built application from builder
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist

# Copy RSA keys (if they exist)
COPY apps/backend/keys ./apps/backend/keys

# Set working directory to backend
WORKDIR /app/apps/backend

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
