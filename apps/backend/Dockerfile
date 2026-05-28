FROM node:22-alpine AS builder

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json package-lock.json turbo.json ./

COPY apps ./apps
COPY packages ./packages

RUN npm ci

RUN npx turbo run build --filter=@uno/backend...

FROM node:22-alpine

RUN apk add --no-cache libc6-compat

WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json turbo.json ./

COPY apps/backend/package.json ./apps/backend/package.json
COPY packages/shared/package.json ./packages/shared/package.json

RUN npm ci --omit=dev

COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist

WORKDIR /app/apps/backend

EXPOSE 2567

CMD ["node", "dist/index.js"]