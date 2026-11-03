FROM api
USER root
RUN apk add --no-cache postgresql17-client
COPY crontab /etc/crontabs/root
COPY backup.sh /usr/local/bin/backup.sh
RUN chmod +x /usr/local/bin/backup.sh
WORKDIR /app
CMD ["sh", "-c", "printenv | sed -n 's/^\(DATABASE_URL=\)\(.*\)$/export \1\"\2\"/p' > /etc/cron.env && exec crond -f -l 8"]
