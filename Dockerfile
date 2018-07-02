FROM node:9.11

ARG ENV=production
ENV NODE_ENV=$ENV
ARG NPMRC_CONTENT="registry=https://npm.lympo.io/\r//npm.lympo.io/:_authToken=override_this_arg_in_host"

RUN echo "$NPMRC_CONTENT" > ~/.npmrc
WORKDIR /app
COPY package*.json /app/

RUN npm install --unsafe-perm
COPY . .

VOLUME /app
VOLUME /app/node_modules

EXPOSE 3000
CMD ["/bin/sh", "-c", "npm run docker:$NODE_ENV"]