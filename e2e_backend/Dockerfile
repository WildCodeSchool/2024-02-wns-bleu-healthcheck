FROM node:lts-alpine

WORKDIR /app

COPY jest.config.js jest.config.js
COPY package.json package.json
RUN npm install

COPY tsconfig.json tsconfig.json

COPY src src

CMD npm run test