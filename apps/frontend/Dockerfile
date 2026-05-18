FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY turbo.json ./

COPY apps/frontend/package*.json ./apps/frontend/

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev", "--workspace=@uno/frontend"]