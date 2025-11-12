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

# Production stage with Nginx
FROM nginx:alpine AS production

# Copy custom nginx configuration
COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built application from builder
COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html

# Create non-root user
RUN addgroup -g 1001 -S nginx && \
    adduser -S nginx -u 1001 -G nginx && \
    chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

# Switch to non-root user
USER nginx

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000 || exit 1

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
