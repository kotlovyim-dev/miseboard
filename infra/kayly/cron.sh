#!/bin/sh
printenv | sed -n 's/^\(DATABASE_URL=\)\(.*\)$/export \1"\2"/p' > /etc/cron.env
exec crond -f -l 8
