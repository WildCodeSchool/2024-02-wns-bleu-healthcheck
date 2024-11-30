#!/user/bin/env bash

# First, we need to check if the database exists.
until pg_isready; do
    echo "Waiting for postgres..."
    sleep 2
done
echo "Creating database $DATABASE_NAME..."; \
psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -c "CREATE DATABASE $DATABASE_NAME"
