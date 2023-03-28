FROM node:18.15.0-alpine AS base
WORKDIR /app
ENV CI=true
COPY package*.json pnpm*.yaml
RUN npm install -g pnpm
COPY . .

FROM base as ressys_api
RUN pnpm --filter @ressys/api install --frozen-lockfile
CMD pnpm --filter @ressys/api start

FROM base as ressys_app
RUN pnpm --filter @ressys/app install --frozen-lockfile \
  && pnpm --filter @ressys/app build
CMD pnpm --filter @ressys/app preview
