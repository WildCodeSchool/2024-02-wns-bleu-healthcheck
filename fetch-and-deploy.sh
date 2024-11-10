#!/usr/bin/env bash

docker pull pierrecastro/healthcheck-frontend:dev
docker pull pierrecastro/healthcheck-backend:dev
docker pull pierrecastro/healthcheck-frontend:prod
docker pull pierrecastro/healthcheck-backend:prod

docker compose --env-file .env.dev -f docker-compose.yml down -d
docker compose --env-file .env.prod -f docker-compose.yml down -d
docker compose --env-file .env.dev -f docker-compose.yml up -d
docker compose --env-file .env.prod -f docker-compose.yml up -d
