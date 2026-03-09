FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Explicitly bake in environment variables into the .env file before building.
# This ensures Vite picks them up even if Docker build-args are handled inconsistently.
ARG VITE_DATABASE_URL
ARG NEON_PROJECT_ID
ARG NEON_API_KEY

RUN echo "VITE_DATABASE_URL=$VITE_DATABASE_URL" > .env && \
    echo "VITE_NEON_PROJECT_ID=$NEON_PROJECT_ID" >> .env && \
    echo "VITE_NEON_API_KEY=$NEON_API_KEY" >> .env

RUN npm run build

FROM nginx:alpine

WORKDIR /usr/share/nginx/html

COPY --from=builder /app/dist /usr/share/nginx/html/daily_gratitude_journal

RUN rm /etc/nginx/conf.d/default.conf
COPY vite-nginx.conf /etc/nginx/conf.d/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
