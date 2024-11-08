FROM node:lts-alpine3.18

RUN mkdir /app
WORKDIR /app

RUN apk --no-cache add curl

COPY package*.json ./
RUN npm i

COPY tsconfig.json tsconfig.json
COPY src src

CMD ["npm", "start"]
