# Stage 1: Build the Next.js application
FROM node:18-alpine AS builder

WORKDIR /app

# Copy the package.json and package-lock.json from /public directory
COPY admin/package.json admin/package-lock.json ./

RUN npm ci --quiet

COPY admin .

ENV IS_DOCKER=true

RUN npm run build

CMD ["npm", "run", "start", "--", "-p", "80"]
