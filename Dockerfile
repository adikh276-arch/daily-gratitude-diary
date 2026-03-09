FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG DATABASE_URL
ARG NEON_PROJECT_ID
ARG NEON_API_KEY
ARG VITE_DATABASE_URL
ARG VITE_NEON_PROJECT_ID
ARG VITE_NEON_API_KEY

ENV DATABASE_URL=${DATABASE_URL:-$VITE_DATABASE_URL}
ENV NEON_PROJECT_ID=${NEON_PROJECT_ID:-$VITE_NEON_PROJECT_ID}
ENV NEON_API_KEY=${NEON_API_KEY:-$VITE_NEON_API_KEY}
ENV VITE_DATABASE_URL=${VITE_DATABASE_URL:-$DATABASE_URL}
ENV VITE_NEON_PROJECT_ID=${VITE_NEON_PROJECT_ID:-$NEON_PROJECT_ID}
ENV VITE_NEON_API_KEY=${VITE_NEON_API_KEY:-$NEON_API_KEY}

RUN npm run build

FROM nginx:alpine

WORKDIR /usr/share/nginx/html

COPY --from=builder /app/dist /usr/share/nginx/html/daily_gratitude_journal

RUN rm /etc/nginx/conf.d/default.conf
COPY vite-nginx.conf /etc/nginx/conf.d/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
