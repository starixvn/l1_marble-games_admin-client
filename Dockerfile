FROM hub.lumigame.com/base/node:22-alpine-25h1.1 AS builder
WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN npm run build

FROM hub.lumigame.com/base/nginx:brotli-1.20.2-zlib@sha256:da65e2f9beb9cc2e87f94ef575852c654bc39c974848da2231cb0747cae04d37

COPY ./nginx.conf /etc/nginx/nginx.conf

WORKDIR /static

COPY --from=builder /app/dist .

EXPOSE 5000

ENTRYPOINT [ "nginx", "-g", "daemon off;" ]
