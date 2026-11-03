#!/bin/sh
set -eu

BACKUP_DIR=${BACKUP_DIR:-/backups}
KEEP=${BACKUP_KEEP:-7}

pg_dump --dbname "$DATABASE_URL" --format custom --file "$BACKUP_DIR/miseboard-$(date -u +%Y%m%dT%H%M%SZ).dump"
ls -1t "$BACKUP_DIR"/miseboard-*.dump | tail -n +$((KEEP + 1)) | xargs -r rm --
