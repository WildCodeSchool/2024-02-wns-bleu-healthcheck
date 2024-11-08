FROM node:lts-alpine3.18

RUN apk --no-cache add curl

WORKDIR /app

COPY public public
COPY index.html index.html

COPY tsconfig.json tsconfig.json
COPY tsconfig.app.json tsconfig.app.json
COPY tsconfig.node.json tsconfig.node.json
COPY vite.config.ts vite.config.ts

COPY package*.json ./

RUN npm install

COPY src src

CMD ["npm", "run", "dev"]
