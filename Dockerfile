FROM node:8.10.0

COPY . /app
WORKDIR /app

RUN mv /app/src/data /app/src/data-default

RUN npm install

ENV PORT 80
EXPOSE 80

CMD ["npm","start"]
