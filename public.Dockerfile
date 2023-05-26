# Stage 1: Build the Next.js application
FROM node:18 AS builder

WORKDIR /app

# Copy the package.json and package-lock.json from /public directory
COPY public/package.json public/package-lock.json ./

RUN npm ci --quiet

COPY public .

RUN npm run build

# Stage 2: Serve the Next.js application with NGINX
FROM nginx:1.23

# Remove default NGINX configurations
RUN rm -rf /etc/nginx/conf.d/*

# Copy the build output from the previous stage
COPY --from=builder /app/out /usr/share/nginx/html

# Copy custom NGINX configuration
COPY public/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
