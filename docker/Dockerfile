FROM nginx:1.17.2-alpine

LABEL maintainer="tqv.itvn@gmail.com"

RUN apk update && apk add curl

COPY ./docker/nginx.conf /etc/nginx/nginx.conf
COPY ./docker/vhost.conf /etc/nginx/conf.d/

WORKDIR /var/www/html

COPY dist/insurrance-webapp .
