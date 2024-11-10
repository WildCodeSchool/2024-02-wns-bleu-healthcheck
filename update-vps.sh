#!/usr/bin/env bash

port=2269
remote_user=wns_student
remote_host=042024-bleu-3.wns.wilders.dev
project_path='$HOME/healthcheck'

echo "This script will update the VPS with the latest version of the project."
echo "You are about to push the following files to the server:"
echo "      - 'docker-compose.yml'"
echo "      - 'fetch-and-deploy.sh'"
echo "      - 'nginx.conf'"
echo "      - '.env.prod'"
echo "      - '.env.dev'"
echo "      - 'db-init.sh'"
echo "Are you sure you want to continue? [y/N]"
read -n 1 -r answer
echo ""

if [[ ! $answer =~ ^[Yy]$ ]]; then
  echo "Aborted."
  exit 1
fi

scp \
  -P $port \
  docker-compose.yml fetch-and-deploy.sh nginx.conf .env.prod .env.dev db-init.sh \
  $remote_user@$remote_host:$project_path/

