FROM node:22-alpine

RUN apk add --no-cache libc6-compat

WORKDIR /app

# Workspace manifests for reproducible npm ci
COPY package.json package-lock.json turbo.json ./
COPY apps/frontend/package.json ./apps/frontend/
COPY apps/backend/package.json ./apps/backend/
COPY packages/shared/package.json ./packages/shared/
COPY packages/ui/package.json ./packages/ui/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/typescript-config/package.json ./packages/typescript-config/

RUN npm ci

COPY . .

RUN chmod +x /app/apps/frontend/docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/app/apps/frontend/docker-entrypoint.sh"]
