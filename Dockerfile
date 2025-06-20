FROM hub.lumigame.com/base/node:20.9.0-alpine-24h1.1 AS builder
WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

FROM hub.lumigame.com/base/nginx:brotli-1.20.2-zlib

COPY ./nginx.conf /etc/nginx/nginx.conf

WORKDIR /static

COPY --from=builder /app/dist .

EXPOSE 5000

ENTRYPOINT [ "nginx", "-g", "daemon off;" ]
