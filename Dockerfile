FROM node:9.11-alpine

ARG NODE_ENV=production
ENV NODE_ENV=$ENV
ARG NPMRC_CONTENT="registry=https://npm.lympo.io/\n//npm.lympo.io/:_authToken=override_this_arg_in_host"

RUN echo -e "$NPMRC_CONTENT" > ~/.npmrc
WORKDIR /app
COPY package*.json /app/

RUN apk --update add git alpine-sdk python python-dev
RUN npm install --unsafe-perm
COPY . .

FROM node:9.11-alpine
WORKDIR /app
COPY --from=0 /app .
EXPOSE 3000
CMD ["sh", "-c", "npm run docker:${NODE_ENV}"]
