FROM node:12.16
ARG ENV=production
ENV NODE_ENV=$ENV

WORKDIR /usr/src/app
COPY package*.json /usr/src/app/

RUN npm install --unsafe-perm
COPY . .

FROM node:12.16
WORKDIR /usr/src/app
COPY --from=0 /usr/src/app .
EXPOSE 3000
CMD ["sh", "-c", "npm run docker:${NODE_ENV}"]
