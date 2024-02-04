#!/bin/bash

cd "$(dirname "$0")"

if [[ "$1" == "start" ]]; then
    docker-compose start
    
elif [[ "$1" == "stop" ]]; then
    docker-compose stop
    
elif [[ "$1" == "up" ]]; then
    docker-compose up -d --wait
    docker exec -w /app rss-app-api-1 composer run migrate
    docker exec -w /app rss-app-api-1 composer run seed
    
elif [[ "$1" == "down" ]]; then
    docker-compose down
    
elif [[ "$1" == "api-sh" ]]; then
    docker exec -it -w /app rss-app-api-1 sh
    
elif [[ "$1" == "pwa-sh" ]]; then
    docker exec -it -w /app rss-app-pwa-1 sh

elif [[ "$1" == "install" ]]; then
    docker run -v ./packages/api:/app -w /app --rm -it rss-app-api composer install
    docker run -v .:/app -w /app --rm -it node:20-alpine3.18 yarn
    
else 
    echo "Usage: ./app.sh [command]"
    echo "Commands:"
    echo "  - start"
    echo "  - stop"
    echo "  - up"
    echo "  - down"
    echo "  - api-sh"
    echo "  - pwa-sh"
fi