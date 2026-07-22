FROM node:22-slim AS base
WORKDIR /app

# copy workspace manifests first for better layer caching
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
COPY packages/shared/package.json packages/shared/package.json

RUN npm ci

# now copy actual source
COPY packages/shared packages/shared
COPY apps/api apps/api

WORKDIR /app/apps/api

EXPOSE 8000

CMD ["npx", "tsx", "src/server.ts"]