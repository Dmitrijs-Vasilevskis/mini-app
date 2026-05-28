FROM node:22-alpine AS builder

RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json turbo.json ./
COPY apps/backend/package.json ./apps/backend/
COPY packages/shared/package.json ./packages/shared/

RUN npm ci

COPY . .

RUN npm run build --workspace=@uno/shared
RUN npm run dev --workspace=@uno/backend

FROM node:22-alpine

RUN apk add --no-cache libc6-compat

WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json turbo.json ./
COPY apps/backend/package.json ./apps/backend/
COPY packages/shared/package.json ./packages/shared/

RUN npm ci --omit=dev

COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/packages/shared ./packages/shared

WORKDIR /app/apps/backend

EXPOSE 2567

CMD ["node","dist/index.js"]