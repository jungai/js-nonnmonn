FROM node:16.6-alpine3.12

WORKDIR /app

ENV TZ=Asia/Bangkok

RUN apk update && \
    apk upgrade && \
    apk add --no-cache \
    tzdata && \
    echo "Asia/Bangkok" > /etc/timezone && \
    npm install -g pnpm

COPY ./package.json ./package.json
COPY ./pnpm-lock.yaml ./pnpm-lock.yaml

RUN pnpm install

COPY . .

CMD ["pnpm", "start"]