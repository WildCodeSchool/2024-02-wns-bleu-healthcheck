FROM node:lts-alpine3.20

RUN mkdir /app
WORKDIR /app

RUN apk --no-cache add curl

COPY package*.json ./
RUN npm i

COPY tsconfig.json tsconfig.json
COPY src src

CMD ["npm", "start"]
