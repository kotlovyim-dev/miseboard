FROM caddy:2-builder AS caddy
RUN xcaddy build --with github.com/mholt/caddy-ratelimit

FROM node:24-alpine AS base
RUN corepack enable
WORKDIR /repo

FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm fetch

FROM deps AS build
COPY . .
RUN pnpm install --offline --frozen-lockfile --filter @miseboard/web... --filter @miseboard/api...
RUN pnpm --filter @miseboard/web build
RUN pnpm --filter @miseboard/api build
RUN pnpm --filter @miseboard/api --prod deploy /out

FROM node:24-alpine
ENV NODE_ENV=production HOSTNAME=0.0.0.0 INTERNAL_GRAPHQL_URL=http://api:4000/graphql
COPY --from=caddy /usr/bin/caddy /usr/bin/caddy
COPY Caddyfile /app/Caddyfile
COPY infra/kayly/crontab /etc/crontabs/root
COPY --chmod=755 infra/kayly/cron.sh /usr/local/bin/cron.sh
WORKDIR /app/web
COPY --from=build /repo/apps/web/.next/standalone ./
COPY --from=build /repo/apps/web/.next/static ./apps/web/.next/static
WORKDIR /app/api
COPY --from=build /out/node_modules ./node_modules
COPY --from=build /out/package.json ./package.json
COPY --from=build /repo/apps/api/dist ./dist
COPY --from=build /repo/apps/api/drizzle ./drizzle
