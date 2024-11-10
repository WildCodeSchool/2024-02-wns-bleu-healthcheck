FROM mcr.microsoft.com/playwright:latest

WORKDIR /app

COPY package.json /app/package.json
RUN npm install

COPY playwright.config.ts /app/playwright.config.ts

COPY tests/ /app/tests/


CMD ["tail", "-f", "/dev/null"]
