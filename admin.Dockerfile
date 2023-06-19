# Stage 1: Build the Next.js application
FROM node:18-alpine AS builder

WORKDIR /app

# Copy the package.json and package-lock.json from /public directory
COPY admin/package.json admin/package-lock.json ./

RUN npm ci --quiet

COPY admin .

RUN npm run build

# Stage 2: Serve the Next.js application with NGINX
FROM nginx:1.23-alpine

# Remove default NGINX configurations
RUN rm -rf /etc/nginx/conf.d/*

# Copy the build output from the previous stage
COPY --from=builder /app/out /usr/share/nginx/html

# Copy custom NGINX configuration
COPY admin/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
