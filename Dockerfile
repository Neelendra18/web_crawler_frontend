# Build stage
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG VITE_API_BASE_URL=http://localhost:8000
ARG VITE_API_TIMEOUT=30000
ARG VITE_APP_NAME="Web Crawler Test Generator"
ARG VITE_APP_VERSION=1.0.0
ARG VITE_ENABLE_ANALYTICS=false
ARG VITE_ENABLE_DEBUG_MODE=false
ARG VITE_SENTRY_DSN=
ARG VITE_OCR_API_BASE_URL=http://localhost:8001

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL \
    VITE_API_TIMEOUT=$VITE_API_TIMEOUT \
    VITE_APP_NAME=$VITE_APP_NAME \
    VITE_APP_VERSION=$VITE_APP_VERSION \
    VITE_ENABLE_ANALYTICS=$VITE_ENABLE_ANALYTICS \
    VITE_ENABLE_DEBUG_MODE=$VITE_ENABLE_DEBUG_MODE \
    VITE_SENTRY_DSN=$VITE_SENTRY_DSN \
    VITE_OCR_API_BASE_URL=$VITE_OCR_API_BASE_URL

RUN npm run build

# Production stage
FROM nginx:1.27-alpine

RUN apk add --no-cache curl

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://127.0.0.1/health || exit 1
