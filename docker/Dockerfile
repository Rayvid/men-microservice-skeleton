FROM node:9.11

WORKDIR /app
COPY package*.json /app/

RUN npm install --unsafe-perm
COPY . .

VOLUME /app
VOLUME /app/node_modules

EXPOSE 3000
CMD ["/bin/sh", "-c", "npm start"]