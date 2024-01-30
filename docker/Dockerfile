FROM php:8.3-fpm-alpine as php
ADD https://github.com/mlocati/docker-php-extension-installer/releases/latest/download/install-php-extensions /usr/local/bin/
RUN chmod +x /usr/local/bin/install-php-extensions && \
    install-php-extensions mysqli && \
    install-php-extensions pdo_mysql && \
    install-php-extensions zip
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

FROM node:20-alpine3.18 as static-for-prod
WORKDIR /app
COPY . .
RUN yarn install
RUN yarn build

FROM php as app-for-prod
WORKDIR /app
COPY packages/api/composer.json composer.json 
COPY packages/api/composer.lock composer.lock 
RUN composer install --no-dev --optimize-autoloader
COPY packages/api .
COPY --from=static-for-prod /app/packages/pwa/dist /app/public
RUN tar -czf /app.tar.gz -C /app .