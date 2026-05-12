#!/bin/bash

if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

BACKUP_DIR="backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/backup_$DB_NAME_$TIMESTAMP.sql"

mkdir -p $BACKUP_DIR

echo "Iniciando backup de la base de datos: $DB_NAME..."


export PGPASSWORD=$DB_PASSWORD
pg_dump -h $DB_HOST -p $DB_PORT -U $DB_USER $DB_NAME > $BACKUP_FILE

if [ $? -eq 0 ]; then
    echo "Backup completado exitosamente: $BACKUP_FILE"
else
    echo "Error al realizar el backup"
    exit 1
fi
