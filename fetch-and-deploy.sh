#!usr/bin/env bash

if [ $1 = "dev" ]; then
  docker pull pierrecastro/healthcheck-frontend:dev
  docker pull pierrecastro/healthcheck-backend:dev
  docker compose --env-file .env.dev -f docker-compose.yml down -d
  docker compose --env-file .env.dev -f docker-compose.yml up -d
  exit 0
elif [ $1 = "prod" ]; then
  docker pull pierrecastro/healthcheck-frontend:prod
  docker pull pierrecastro/healthcheck-backend:prod
  docker compose --env-file .env.prod -f docker-compose.yml down -d
  docker compose --env-file .env.prod -f docker-compose.yml up -d
  exit 0
fi

echo "Invalid argument. Please use 'dev' or 'prod'." >&2
exit 1
