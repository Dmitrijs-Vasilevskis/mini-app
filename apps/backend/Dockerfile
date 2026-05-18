FROM node:22.2.0-alpine

WORKDIR /app

COPY package*.json ./
COPY turbo.json ./

COPY apps/backend/package*.json ./apps/backend/

RUN npm install

COPY . .

EXPOSE 2567

CMD ["npm", "run", "dev", "--workspace=@uno/backend"]